// 篩選星期
const getWeekdays = (startDate, availableWeekday) => {
  const todayDay = new Date(startDate).getDay();
  const result = [];
  let milli = startDate;
  for (let i = todayDay; i < todayDay + 7; i++) {
    if (availableWeekday[i % 7]) {
      result.push({ day: i, date: milli });
      milli += 24 * 60 * 60 * 1000;
    } else {
      milli += 24 * 60 * 60 * 1000;
    }
  }
  return result;
};

// 取得 課程間隔時間陣列
const getHours = (startHour, endHour, courseDuration) => {
  const result = [];
  for (let i = 0; i < endHour - startHour; i++) {
    result.push(i + startHour);
    courseDuration === 1 ? i : (i -= courseDuration);
  }
  return result;
};

// 取得未來 delayDay 的單日所有課程時間
const futureDate = (startDate, hourList, delayDay) => {
  const millisecond = delayDay * 24 * 60 * 60 * 1000;
  // 預約今天以後的課程
  if (delayDay !== 0) {
    const result = hourList.map((hour) => {
      if (Number.isInteger(hour)) {
        return new Date(startDate + millisecond).setHours(hour, 0, 0);
      }
      return new Date().setHours(hour, 30, 0);
    });
    return result;
  }
  // 今天能預約的時間
  const todayHours = hourList.map((hour) => {
    return hour > new Date().getHours() ? hour : 25;
  });
  
  // 排除不能預約的時間
  const filterHours = todayHours.filter((item) => {
    return item !== 25;
  });
 
  // 整理格式
  const result = filterHours.map((hour) => {
    if (Number.isInteger(hour)) {
      return new Date(startDate + millisecond).setHours(hour, 0, 0);
    }
    return new Date(startDate + millisecond).setHours(hour, 30, 0);
  });

  // 返回毫秒數
  return result;
};

// 刪除陣列重複值
const removeDuplicates = (arr) => {
  arr.forEach((i) => {
    (i / 1000).toFixed(0);
  });
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      arr.splice(i, 2);
      i--;
    }
  }
  arr.forEach((i) => {
    i * 1000;
  });
  return arr;
};

module.exports = {
  getWeekdays,
  getHours,
  futureDate,
  removeDuplicates,
};
