const getAsync = (): Promise<number> => {
  return new Promise((resolve) => {
    resolve(1);
  });
};

const fillArray = (length: number) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i);
  }
  return arr;
};
export const workWithReduce = async (n: number) => {
  const initialValueForReduce = 0;

  const filledArray = fillArray(n);
  const promisesArray = filledArray.map(getAsync);
  const awaitedPromises = await Promise.all(promisesArray);

  return awaitedPromises.reduce(
    (accum, currentValue, currentIndex) => accum + currentValue + currentIndex,
    initialValueForReduce
  );
};

export const workWithFor = async (n) => {
  let res = 0;
  const filledArray = fillArray(n);
  for (let i = 0; i < filledArray.length; i++) {
    const promiseResult = await getAsync();
    res = res + promiseResult + i;
  }
  return res;
};

export const workWithMap = async (n: number): Promise<number> => {
  const filledArray = fillArray(n);
  const promisesArr = filledArray.map(async (item, index) => {
    let promiseRes = await getAsync();
    promiseRes = promiseRes + index;
    return promiseRes;
  });
  const results = await Promise.all(promisesArr);
  return results.reduce((a, b) => a + b, 0);
};
