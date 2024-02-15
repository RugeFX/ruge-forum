const fetchCount = (amount = 1) => new Promise<{ data: number }>((resolve) => {
  setTimeout(() => resolve({ data: amount }), 500);
});

export default fetchCount;
