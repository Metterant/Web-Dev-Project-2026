import MainContainer from '../MainContainer';
import './MySchedule.css';
import '../App.css';
import { apiFetch } from '../services/apiClient';
import { getCurrentUser } from '../services/authClient';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const getSemesterFromParams = (params) => {
  return params.get('semester') ?? '';
};

export default function MySchedule({ startHour = 8, endHour = 18, days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }) {
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const hours = useMemo(() => {
    const arr = [];
    for (let h = startHour; h < endHour; h++) arr.push(h);
    return arr;
  }, [startHour, endHour]);

  // Helper to compute grid row start/span given startHour and 1-hour periods
  const toGridRow = (startPeriod, endPeriod) => {
    const rowStart = startPeriod + 1; // +1 for header row, +1 for 1-based indexing
    const span = Math.max(1, endPeriod - startPeriod);
    return { rowStart, span };
  };

  const toGridCol = (dayOfWeek) => {
    const day = dayOfWeek.slice(0, 3);
    
    for (let i = 0; i < days.length; i++) {
      if (day === days.at(i))
        return i;
    }
  }

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((u) => {
      if (mounted) setUser(u);
    });
    return () => { mounted = false; };
  }, []);

  const loadCourses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        semester: getSemesterFromParams(searchParams)
      });

      let fetchUrl = '';

      if (user?.role === 'student')
        fetchUrl = `/api/students/${user.student_id}/schedule?${params.toString()}`;
      else if (user?.role === 'instructor')
        fetchUrl = `/api/instructors/${user.instructor_id}/schedule${params.toString()}`;
      else return;

      const response = await apiFetch(fetchUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setSchedule(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load schedule:', err);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, user]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    let shouldReplace = false;

    if (!nextParams.has('semester')) {
      nextParams.set('semester', '20251');
      shouldReplace = true;
    }

    if (shouldReplace) {
      setSearchParams(nextParams, { replace: true });
      return;
    }

    loadCourses();
  }, [searchParams, setSearchParams, loadCourses]);

  return (
    <MainContainer>
      <h2>My Schedule</h2>

      {loading ? (
        <p>Loading schedule...</p>
      ) : schedule && schedule.length > 0 ? (
        <div className="week-schedule">
          <div className="schedule-grid">
            {/* Time header (empty corner) */}
            <div className="time-header-corner" />
        
            {/* Day headers */}
            {days.map((d) => (
              <div key={d} className="day-header">
                {d}
              </div>
            ))}

            {/* Time labels and grid cells */}
            {hours.map((h, hIdx) => {
              const rowNum = hIdx + 2; // +1 for header row, +1 for 1-based indexing
              return (
                <div key={`time-${h}`} className="time-label" style={{ gridRow: rowNum }}>
                  {h}:00
                </div>
              );
            })}

            {/* Empty cells for visual grid */}
            {hours.flatMap((h, hIdx) => {
              const rowNum = hIdx + 2;
              return days.map((_, dayIdx) => (
                <div
                  key={`cell-${dayIdx}-${h}`}
                  className="grid-cell"
                  style={{ gridColumn: dayIdx + 2, gridRow: rowNum }}
                />
              ));
            })}

            {/* Courses */}
            {schedule.map((c) => {
              if (!c.start_period || !c.end_period) return null;
              const { rowStart, span } = toGridRow(c.start_period, c.end_period);
              // gridColumn: dayIndex + 2 because first column is time labels
              const col = (toGridCol(c.day_of_week)) + 2;
              const style = {
                gridColumn: `${col} / ${col + 1}`,
                gridRow: `${rowStart} / span ${span}`,
                zIndex: rowStart
              };
              return (
                <div
                  key={c.course_id}
                  className="course-block"
                  style={style}
                  title={`${c.course_name || c.title} (${c.start_period}:00–${c.end_period}:00)`}
                >
                  <div className="course-title">{c.course_name || c.title}</div>
                  <div className="course-meta">
                    {c.room && <span>{c.room}</span>}
                    {c.room && c.instructor_code && <span> • </span>}
                    {c.instructor_code && <span>{c.instructor_code}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>No courses scheduled for this semester.</p>
      )}
    </MainContainer>
  );
}