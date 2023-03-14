class MyPromise {
  constructor() {
    this.mp = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export default MyPromise