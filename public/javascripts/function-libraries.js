function requestDataLoading(url, options, callback, fallout) {
    $.ajax({
      type: options.method,
      url: url,
      data: options.params,
      beforeSend: function (jqXHR, settings) {
        iziToast.info({
          message: 'Loading ...',
          timeout: 0,
          toastOnce: true
        })
      },
      success: function (data) {
        iziToast.destroy()
        callback(data)
      },
      error: function (xhr, textStatus, err) {
        iziToast.destroy()
        if (xhr.status === 408) {
          iziToast.error({
            title: "Sorry !",
            message: "Request Timeout !",
            timeout: 4000
          })
        }
        if (fallout) {
          fallout(xhr)
        } else {
          iziToast.error({
            title: xhr.statusText,
            message: xhr.responseText,
            timeout: 4000
          })
        }
      }
    })
  }
  
  function requestData(url, options, callback, fallout) {
    $.ajax({
      type: options.method,
      url: url,
      data: options.params,
      success: function (data) {
        // iziToast.destroy()
        callback(data)
      },
      error: function (xhr, textStatus, err) {
        iziToast.destroy()
        if (xhr.status === 408) {
          iziToast.error({
            title: "Sorry !",
            message: "Request Timeout !",
            timeout: 4000
          })
        }
        if (fallout) {
          fallout(xhr)
        } else {
          iziToast.error({
            title: xhr.statusText,
            message: xhr.responseText,
            timeout: 4000
          })
        }
      }
    })
  }
  
  function convertTimestamp(timestamp) {
    let d = new Date(timestamp),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = '' + d.getHours(),
      minute = '' + d.getMinutes(),
      second = '' + d.getSeconds()
    if (month.length < 2)
      month = '0' + month
    if (day.length < 2)
      day = '0' + day
    if (hour.length < 2)
      hour = '0' + hour
    if (minute.length < 2)
      minute = '0' + minute
    if (second.length < 2)
      second = '0' + second
    return [year, month, day].join('/') + ' ' + [hour, minute, second].join(':')
  }
  
  function currencyFormat(num) {
    var format = new Intl.NumberFormat('en-ID', {
      style: 'currency',
      currency: 'IDR'
    })
    return format.format(num)
  }
  
  function unCurrencyFormat(val) {
    if (val) {
      return Number(val.replace(/[^0-9.-]+/g, ''))
    } else {
      return 0
    }
  }
  
  function isNumber(evt) {
    evt = (evt) || window.event
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }
  
  function addSuccessNotification(title, message, timer) {
    iziToast.success({
      title: title,
      message: message,
      timeout: timer
    })
  }
  
  function addFailNotification(title, message, timer) {
    iziToast.error({
      title: title,
      message: message,
      timeout: timer
    })
  }
  
  function addInfoNotification(title, message, timer) {
    iziToast.info({
      title: title,
      message: message,
      timeout: timer
    })
  }
  
  function getAge(dateString) {
    var now = new Date()
  
    var yearNow = now.getYear()
    var monthNow = now.getMonth()
    var dateNow = now.getDate()
    var datesplt = dateString.split('/')
    var dob = new Date(datesplt[2], datesplt[0] - 1, datesplt[1])
  
    var yearDob = dob.getYear()
    var monthDob = dob.getMonth()
    var dateDob = dob.getDate()
    var age = {}
    var ageString = '';
    var yearString = '';
    var monthString = '';
    var dayString = '';
  
    yearAge = yearNow - yearDob
  
    if (monthNow >= monthDob) {
      var monthAge = monthNow - monthDob;
    } else {
      yearAge--
      var monthAge = 12 + monthNow - monthDob
    }
  
    if (dateNow >= dateDob) {
      var dateAge = dateNow - dateDob;
    } else {
      monthAge--
      var dateAge = 31 + dateNow - dateDob
  
      if (monthAge < 0) {
        monthAge = 11
        yearAge--
      }
    }
  
    age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
    }
  
    if (age.years > 1) yearString = ' years';
    else yearString = ' year';
    if (age.months > 1) monthString = ' months';
    else monthString = ' month';
    if (age.days > 1) dayString = ' days';
    else dayString = ' day';
  
    if ((age.years > 0) && (age.months > 0) && (age.days > 0)) {
      ageString = age.years + yearString + ", " + age.months + monthString + ", and " + age.days + dayString + " old.";
    } else if ((age.years == 0) && (age.months == 0) && (age.days > 0)) {
      ageString = age.days + dayString + " old.";
    } else if ((age.years > 0) && (age.months == 0) && (age.days == 0)) {
      ageString = age.years + yearString + " old.";
    } else if ((age.years > 0) && (age.months > 0) && (age.days == 0)) {
      ageString = age.years + yearString + " and " + age.months + monthString + " old.";
    } else if ((age.years == 0) && (age.months > 0) && (age.days > 0)) {
      ageString = age.months + monthString + " and " + age.days + dayString + " old.";
    } else if ((age.years > 0) && (age.months == 0) && (age.days > 0)) {
      ageString = age.years + yearString + " and " + age.days + dayString + " old.";
    } else if ((age.years == 0) && (age.months > 0) && (age.days == 0)) {
      ageString = age.months + monthString + " old.";
    } else ageString = 'Oops! Could not calculate age!';
    return ageString
  }
  
  function convert(input) {
    var node
    node = JsonHuman.format(input)
    return node
  }