class ArrayHelper {
  public groupByArray(data: any, key: any) {
    const groupedObj = data.reduce((prev: any, cur: any) => {
      if (!prev[cur[key]]) {
        prev[cur[key]] = [cur]
      } else {
        prev[cur[key]].push(cur)
      }
      return prev
    }, {})
    return Object.keys(groupedObj).map(Heading => ({
      heading: Heading,
      list: groupedObj[Heading],
    }))
  }
}

export default new ArrayHelper()
