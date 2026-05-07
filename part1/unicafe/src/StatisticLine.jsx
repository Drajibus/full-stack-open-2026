const StatisticLine = (props) => {
  return (
    <div>
      <p>
        {props.text} {props.value} {props.units}
      </p>
    </div>
  );
};

export default StatisticLine;
