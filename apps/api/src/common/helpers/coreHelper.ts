class CoreHelper {
  public getDateString(d: Date, format: string) {
    let datestring = '';
    switch (format) {
      case 'yyyyMMddHHmmss': {
        datestring =
          d.getFullYear() +
          ('0' + (d.getMonth() + 1)).slice(-2) +
          ('0' + d.getDate()).slice(-2) +
          ('0' + d.getHours()).slice(-2) +
          ('0' + d.getMinutes()).slice(-2) +
          ('0' + d.getSeconds()).slice(-2);
        break;
      }
      default:
        datestring =
          ('0' + d.getDate()).slice(-2) +
          '-' +
          ('0' + (d.getMonth() + 1)).slice(-2) +
          '-' +
          d.getFullYear() +
          ' ' +
          ('0' + d.getHours()).slice(-2) +
          ':' +
          ('0' + d.getMinutes()).slice(-2);
        break;
    }
    return datestring;
  }

  public stringInject(str: string, data: any) {
    if (typeof str === 'string' && data instanceof Array) {
      return str.replace(/({\d})/g, function (i: any) {
        return data[i.replace(/{/, '').replace(/}/, '')];
      });
    } else if (typeof str === 'string' && data instanceof Object) {
      if (Object.keys(data).length === 0) {
        return str;
      }

      for (const key in data) {
        return str.replace(/({([^}]+)})/g, function (i) {
          const key = i.replace(/{/, '').replace(/}/, '');
          if (!data[key]) {
            return i;
          }

          return data[key];
        });
      }
    } else if (
      (typeof str === 'string' && data instanceof Array === false) ||
      (typeof str === 'string' && data instanceof Object === false)
    ) {
      return str;
    } else {
      return '';
    }
  }

  public async convertObjToArray(obj: any) {
    const arr = [];
    // tslint:disable-next-line:forin
    for (const key in obj) {
      const value = obj[key];
      arr.push(value);
    }
    return arr;
  }

  isDateInArray(needle: Date, haystack: Date[]) {
    for (var i = 0; i < haystack.length; i++) {
      const temp = new Date(haystack[i].setHours(0, 0, 0, 0));
      if (needle.getTime() === temp.getTime()) {
        return true;
      }
    }
    return false;
  }

  monthDiff(d1: Date, d2: Date) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  removeQuotes(str: string) {
    const formatedString = str.replace(/"/g, '');

    return formatedString;
  }

  isEmpty(value: string | Array<unknown> | object | null | undefined) {
    if (typeof value === 'string') {
      return value.trim() === '';
    } else if (Array.isArray(value)) {
      return value.length === 0;
    } else if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length === 0;
    } else {
      return true; // Treat all other types as empty
    }
  }
}

export default new CoreHelper();
