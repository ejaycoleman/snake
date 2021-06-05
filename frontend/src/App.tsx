import logo from './logo.svg';
import './App.css';

interface RowInt {
  y: number
}

interface CellInt {
  x: number
  y: number
}

const gridArray: number[] = []
const gridSize = 35;

for (let i = 0; i <= gridSize; i++) {
  gridArray.push(i);
}

const Grid = (): JSX.Element => 
<div>
  {gridArray.map(y => 
    <Row
      y={y}
      key={y}
    />  
  )}
</div>

const Row = ({y}: RowInt) => 
  <div className='grid-row'>
    {gridArray.map(x => 
      <Cell
        x={x}
        y={y}
        key={x}
      />
    
    )}
  </div>

const Cell = ({x, y}: CellInt): JSX.Element => 
  <div className={isBorder(x, y) ? 'border cell' : 'cell'}/>

const isBorder = (x: number, y: number) => 
      x === 0 || y === 0 || x === gridSize || y === gridSize

function App() {
  return (
    <div className="App">
        <Grid></Grid>
    </div>
  );

  
}




export default App;
