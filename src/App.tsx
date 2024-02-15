import { useAppDispatch, useAppSelector } from 'app/hooks';
import { incrementAsync } from 'features/counter/counter-slice';

function App() {
  const counter = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  const onIncrease = () => {
    dispatch(incrementAsync(1));
  };

  return (
    <main>
      <h1 className="text-3xl text-amber-500 font-bold">Hello World!</h1>
      <h2>{counter.value}</h2>
      <button type="button" onClick={onIncrease} className="border p-2">
        Increase
      </button>
    </main>
  );
}

export default App;
