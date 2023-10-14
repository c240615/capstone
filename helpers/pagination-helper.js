const getOffset = (limit = 10, page = 1) => (page - 1) * limit;
const getPagination = (limit = 10, page = 1, total = 50) => {
  // 總共幾頁
  const totalPage = Math.ceil(total / limit);
  // 導覽器按鈕 [0,1,2,3] => [1,2,3,4]
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1);
  // 使用者點擊的頁面
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page;
  // 使用者點擊的前頁
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1;
  // 使用者點擊的後頁
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1;
  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next,
  };
};
module.exports = {
  getOffset,
  getPagination,
};
