const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>
        {props.value} {props.units}
      </td>
    </tr>
  );
};

export default StatisticLine;
