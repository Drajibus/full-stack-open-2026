const Total = ({ parts }) => {
  return (
    <div>
      <p>
        <b>total of {parts.reduce((s, p) => s + p.exercises, 0)} exercises</b>
      </p>
    </div>
  );
};

export default Total;
