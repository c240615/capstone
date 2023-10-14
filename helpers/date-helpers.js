const futureDate = (start, courseDuration) => {
  // 起始點
  const startDate = start;
  // 延後 DELAY 天
  const change2 = 86400000 * 7;
  const change3 = 86400000 * 14;
  // 結束日
  if (courseDuration === 1) {
    const endDate1 = new Date(startDate).setHours(18, 0, 0);
    const endDate2 = new Date(startDate).setHours(19, 0, 0);
    const endDate3 = new Date(startDate).setHours(20, 0, 0);

    const endDate5 = new Date(startDate + change2).setHours(18, 0, 0);
    const endDate6 = new Date(startDate + change2).setHours(19, 0, 0);
    const endDate7 = new Date(startDate + change2).setHours(20, 0, 0);

    const endDate9 = new Date(startDate + change3).setHours(18, 0, 0);
    const endDate10 = new Date(startDate + change3).setHours(19, 0, 0);

    const endDate11 = new Date(startDate + change3).setHours(20, 0, 0);

    return [
      endDate1,
      endDate2,
      endDate3,
      endDate5,
      endDate6,
      endDate7,
      endDate9,
      endDate10,
      endDate11,
    ];
  } else {
    const endDate1 = new Date(startDate).setHours(18, 0, 0);
    const endDate2 = new Date(startDate).setHours(19, 0, 0);
    const endDate3 = new Date(startDate).setHours(20, 0, 0);

    const endDate5 = new Date(startDate + change2).setHours(18, 0, 0);
    const endDate6 = new Date(startDate + change2).setHours(19, 0, 0);
    const endDate7 = new Date(startDate + change2).setHours(20, 0, 0);

    const endDate9 = new Date(startDate + change3).setHours(18, 0, 0);
    const endDate10 = new Date(startDate + change3).setHours(19, 0, 0);

    const endDate11 = new Date(startDate + change3).setHours(20, 0, 0);

    const endDate13 = new Date(startDate).setHours(18, 30, 0);
    const endDate14 = new Date(startDate).setHours(19, 30, 0);
    const endDate15 = new Date(startDate).setHours(20, 30, 0);

    const endDate17 = new Date(startDate + change2).setHours(18, 30, 0);
    const endDate18 = new Date(startDate + change2).setHours(19, 30, 0);

    const endDate19 = new Date(startDate + change2).setHours(20, 30, 0);

    const endDate21 = new Date(startDate + change3).setHours(18, 30, 0);

    const endDate22 = new Date(startDate + change3).setHours(19, 30, 0);

    const endDate23 = new Date(startDate + change3).setHours(20, 30, 0);

    return [
      endDate1,
      endDate2,
      endDate3,
      endDate5,
      endDate6,
      endDate7,
      endDate9,
      endDate10,
      endDate11,
      endDate13,
      endDate14,
      endDate15,
      endDate17,
      endDate18,
      endDate19,
      endDate21,
      endDate22,
      endDate23,
    ];
  }
};
// 刪除陣列重複值
const removeDuplicates = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      arr.splice(i, 2);
      i--;
    }
  }
};
module.exports = {
  futureDate,
  removeDuplicates,
};
