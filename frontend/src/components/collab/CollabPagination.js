import { Pagination } from "react-bootstrap";

function CollabPagination(props) {
  const numberOfResults = props.numberOfResults;
  var firstNumber = props.currentPage - 5;

  var lastNumber = Math.ceil(numberOfResults / props.resultsPerPage);

  if (lastNumber - firstNumber < 9) {
    firstNumber = lastNumber - 9;
  }
  firstNumber = firstNumber < 1 ? 1 : firstNumber;
  let items = [];

  if (firstNumber > 2) {
    items.push(
      <Pagination.Item
        onClick={() => props.setCurrentPage(1)}
        key={1}
        active={1 === props.currentPage}
        disabled={props.loading}
      >
        {1}
      </Pagination.Item>
    );
    items.push(<Pagination.Ellipsis />);
  }

  for (let number = firstNumber; number <= lastNumber; number++) {
    if (number - firstNumber > 8 && lastNumber - number > 2) {
      items.push(<Pagination.Ellipsis />);

      items.push(
        <Pagination.Item
          onClick={() => props.setCurrentPage(lastNumber)}
          key={lastNumber}
          active={lastNumber === props.currentPage}
          disabled={props.loading}
        >
          {lastNumber}
        </Pagination.Item>
      );
      break;
    }

    items.push(
      <Pagination.Item
        onClick={() => props.setCurrentPage(number)}
        key={number}
        active={number === props.currentPage}
        disabled={props.loading}
      >
        {number}
      </Pagination.Item>
    );
  }

  const paginationBasic = <Pagination>{items}</Pagination>;

  return <div className="graph-pagination">{paginationBasic}</div>;
}

export default CollabPagination;
