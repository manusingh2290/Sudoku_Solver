document.addEventListener('DOMContentLoaded', function() {
    const sudokuGrid = document.getElementById('sudokuGrid');
    const solveBtn = document.getElementById('solveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exampleBtn = document.getElementById('exampleBtn');
    const validateBtn = document.getElementById('validateBtn');
    const statusMessage = document.getElementById('statusMessage');

    // Generate input grid
    function createGrid() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.maxLength = 1;
                cell.classList.add('sudoku-cell');
                cell.id = `cell-${row}-${col}`;
                sudokuGrid.appendChild(cell);

                cell.addEventListener('input', function() {
                    const val = parseInt(cell.value);
                    if (isNaN(val) || val < 1 || val > 9) {
                        cell.value = '';
                    }
                });
            }
        }
    }

    createGrid();

    function getBoardFromInput() {
        const board = [];
        for (let i = 0; i < 9; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                const value = parseInt(cell.value) || 0;
                row.push(value);
            }
            board.push(row);
        }
        return board;
    }

    function setBoardToInput(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                cell.value = board[i][j] === 0 ? '' : board[i][j];
            }
        }
    }

    function clearBoard() {
        setBoardToInput(
            Array.from({ length: 9 }, () => Array(9).fill(0))
        );
    }

    function displayMessage(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = `status ${type}`;
    }

    solveBtn.addEventListener('click', function() {
        const board = getBoardFromInput();
        const solver = new SudokuSolver();

        displayMessage('Solving...', 'info');

        setTimeout(() => {
            if (!solver.is_valid_board(board)) {
                displayMessage('Invalid board configuration!', 'error');
                return;
            }

            const solution = JSON.parse(JSON.stringify(board)); // Deep copy

            if (solver.solve(solution)) {
                setBoardToInput(solution);
                displayMessage('Solution found!', 'success');
            } else {
                displayMessage('No solution exists for this puzzle!', 'error');
            }
        }, 0);
    });

    clearBtn.addEventListener('click', function() {
        clearBoard();
        displayMessage('', '');
    });

    exampleBtn.addEventListener('click', function() {
        const examplePuzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
        setBoardToInput(examplePuzzle);
        displayMessage('Example puzzle loaded.', 'info');
    });

    validateBtn.addEventListener('click', function() {
        const board = getBoardFromInput();
        const solver = new SudokuSolver();

        if (solver.is_valid_board(board)) {
            displayMessage('Current board is valid for solving.', 'success');
        } else {
            displayMessage('Invalid board detected!', 'error');
        }
    });

    // Sudoku Solver Logic (as used previously)
    class SudokuSolver {
        constructor() {
            this.size = 9;
            this.box_size = 3;
        }

        is_valid(board, row, col, num) {
            for (let x = 0; x < this.size; x++) {
                if (board[row][x] === num || board[x][col] === num) {
                    return false;
                }
            }

            const startRow = row - (row % this.box_size);
            const startCol = col - (col % this.box_size);
            for (let i = 0; i < this.box_size; i++) {
                for (let j = 0; j < this.box_size; j++) {
                    if (board[i + startRow][j + startCol] === num) {
                        return false;
                    }
                }
            }
            return true;
        }

        find_empty_location(board) {
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    if (board[r][c] === 0) {
                        return { row: r, col: c };
                    }
                }
            }
            return null;
        }

        solve(board) {
            const emptyLoc = this.find_empty_location(board);
            if (!emptyLoc) return true;
            const { row, col } = emptyLoc;

            for (let num = 1; num <= this.size; num++) {
                if (this.is_valid(board, row, col, num)) {
                    board[row][col] = num;

                    if (this.solve(board)) {
                        return true;
                    }

                    board[row][col] = 0;
                }
            }
            return false;
        }

        is_valid_board(board) {
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    if (board[r][c] !== 0) {
                        const num = board[r][c];
                        board[r][c] = 0;
                        if (!this.is_valid(board, r, c, num)) {
                            board[r][c] = num;
                            return false;
                        }
                        board[r][c] = num;
                    }
                }
            }
            return true;
        }
    }
});

