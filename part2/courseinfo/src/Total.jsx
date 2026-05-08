const Total = ({ parts }) => {
  return (
    <div>
      <p>total of {parts.reduce((s, p) => s + p.exercises, 0)} exercises</p>
    </div>
  );
};

export default Total;
