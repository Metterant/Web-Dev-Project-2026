// Number of results per page
const PAGE_SIZE = 20;

// page: the current page
// size: the number of results per page
function getOffset(page) {
    let offset = (page - 1) * PAGE_SIZE;
    return offset && (offset >= 0);
}

module.exports = { getOffset, PAGE_SIZE };