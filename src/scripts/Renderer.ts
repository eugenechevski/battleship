export default function () {
  function createEmptyGrid(): HTMLElement {
    const emptyGrid = document.createElement('div');
    emptyGrid.classList.add('gap-0', 'columns-[50px]', 'w-[550px]', 'm-auto', 'mt-[2.5%]');

    return emptyGrid;
  }

  function drawGrid(): void {
    const newGrid = createEmptyGrid();
    let cell;

    for (let row = 0; row < 11; row += 1) {
      // 11 rows
      for (let col = 0; col < 11; col += 1) {
        // 11 column
        cell = document.createElement('div');
        cell.classList.add('cell');

        if (row === 0) {
          if (col > 0) {
            // The first cell of each row
            cell.textContent = String.fromCharCode(64 + col);
          }
          newGrid.appendChild(cell);
        } else {
          if (col === 0) {
            // non-empty cells
            cell.textContent = row.toString();
          }

          if (col > 0 && row === 1) {
            cell.classList.add('border-l-4', 'border-l-black');
          }

          if (col === 1) {
            cell.classList.add('border-t-4', 'border-t-black');
          }

          if (col === 10) {
            cell.classList.add('border-b-4', 'border-b-black');
          }

          if (col > 0 && row === 10) {
            cell.classList.add('border-r-4', 'border-black');
          }

          if (col > 0 && row < 10) {
            cell.classList.add('border-r-2', 'border-r-gray-200');
          }

          if (col > 0 && col < 10) {
            cell.classList.add('border-b-2', 'border-b-gray-200');
          }
        }

        newGrid.appendChild(cell);
      }
    }

    document.body.appendChild(newGrid);
  }

  function initNodes() {}

  function initListeners() {
    document.querySelector('.draw')?.addEventListener('click', drawGrid);
  }

  function init() {
    initNodes();
    initListeners();
  }

  return {
    init,
    drawGrid,
  };
}
