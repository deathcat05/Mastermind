import React, { Component } from 'react';
import './Mastermind.css';

const red = require('./images/redCircle.png');
const blue = require('./images/blueCircle.png');
const green = require('./images/greenCircle.png');
const purple = require('./images/purpleCircle.png');
const teal = require('./images/tealCircle.png');
const magenta = require('./images/magentaCircle.png');
const emptyCircle = require('./images/emptyCircle.png');

//Board Size for Mastermind table
const NUM_ROWS = 8, NUM_COLS = 5;


class StatusRow extends Component {
    
render(){
    let color = this.props.statusCircle.color;
    let colorName = this.props.statusCircle.colorName;
    console.log('Inside status row. color is: ', color);
    return (
            <table className="status_circles">
                <tbody>
                    <tr><td><img className="large_circle" src={blue} alt="blue circle" /></td>
                    <td><img className="large_circle" src={color} alt={colorName}/></td></tr>
                </tbody>
            </table>
    );
}
}
class Palette extends Component {

    render() {
        console.log("in Pallete Class.");
        return (
            
            <table className="palette_circles">
                <tbody>
                    <tr>
                        {
                            this.props.paletteColors.map((paletteElement, idx) =>
                                <td key={idx} onClick={() => this.props.selectedPaletteCircle(paletteElement)}>
                                    <img className="large_circle" src={paletteElement.color} alt={paletteElement.colorName} /></td>)
                        }
                    </tr>
                </tbody>
            </table>
        )
    }
}
class Circle extends Component {
    render() {
        console.log('circle is:', this.props.circle);
        return (
            <td>
                <img className="large_circle" onClick={() => this.props.handleCircleColorChange(this.props.circleIdx)} src={this.props.circle.color} alt={this.props.circle.colorName} />
            </td>
        );
    }
    
}
class MastermindTableRow extends Component {
    feedbackCircles(feedback) {
        return (<table>
            <tbody className="feedback_table">
                <tr><td><img className="small_circle" src={feedback[0].color} alt={feedback[0].colorName} /></td>
                    <td><img className="small_circle" src={feedback[1].color} alt={feedback[1].colorName} /></td></tr>
                <tr><td><img className="small_circle" src={feedback[2].color} alt={feedback[2].colorName} /></td>
                    <td><img className="small_circle" src={feedback[3].color} alt={feedback[3].colorName} /></td></tr>
            </tbody>
        </table>);
    }
    render() {
        let feedback = undefined;
            return (
            <tr>
                {this.props.row.map((circle, idx) => <Circle circleIdx={idx} circle={circle} selectedPaletteCircle={this.props.selectedPaletteCircle} handleCircleColorChange={this.props.handleCircleColorChange}/> )}
                    
                    
                    
                    <td className="feedback_cell">{feedback ? this.props.feedbackArray.feedbackCircles(feedback) : ""}</td>
            </tr>);
    }
}
class MastermindTable extends Component {
    render() {
        console.log(this.props.feedbackArray);
        return (
            
            <table className="board_table">
                    <tbody>
                        <MastermindTableRow row={this.props.mastermindArray} statusCircle={this.props.statusCircle} feedbackArray={this.props.feedbackArray} handleCircleColorChange={this.props.handleCircleColorChange}/>
                    </tbody>
            </table>
        );
    }

}
class Mastermind extends Component {

    paletteColors = [
        {color: green, colorName: 'Green'},
        {color: teal, colorName: 'Teal'},
        {color: magenta, colorName: 'Magenta'},
        {color: blue, colorName: 'Blue'},
        {color: red, colorName: 'Red'},
        {color: purple, colorName: 'Purple'}
    ];

    nonFilledCircle = {
        color: emptyCircle,
        colorName: 'Empty circle'
    };


    constructor(props) {
        super(props);

        //Initialization of the mastermind table. All circles are initially empty.
        let activeRow = [
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle,
        ];
        //let nextRow = [this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle, this.nonFilledCircle];

        let activeRowFeedback = [
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle
        ];

        //Mastermind Table Initialization
        let mastermindtable = Array(NUM_ROWS).fill(Array(NUM_COLS).fill({cirlce: this.nonFilledCircle}));
        mastermindtable.map((row, rowIdx) => row.map((col, colIdx) =>{
            return{...mastermindtable[rowIdx][colIdx], row: rowIdx, col: colIdx}

        }));


        console.log('mastermindtable is:' ,mastermindtable);
        this.state = {
            mastermindtable,
            mastermindArray: activeRow,
            feedbackArray: activeRowFeedback,
            statusCircle: {color: emptyCircle, colorName: 'Empty circle'}
        }

        console.log('mastermind array is: ', this.state.mastermindArray)
        this.selectedPaletteCircle = this.selectedPaletteCircle.bind(this);
       this.handleCircleColorChange = this.handleCircleColorChange.bind(this);
    }

    componentDidMount() {

    }

    selectedPaletteCircle(circle) {
        console.log('selected a palette color', circle.colorName);
        this.setState({statusCircle: circle});
    }
    handleCircleColorChange(circleIdx){
        console.log('inside handleCircleColorChange function');
        console.log('coldIdx is:', circleIdx);
        console.log('clicked circle is', this.state.mastermindArray[circleIdx]);
        console.log('status circle is', this.state.statusCircle);

        console.log('circle  color is ', this.state.circleColor);

        let circleRowIdx = this.state.mastermindArray[circleIdx];
       
        let theCircleRow = this.state.mastermindArray.slice();
        theCircleRow[circleIdx] = {circle: this.state.statusCircle};


        let newMastermindTable = this.state.mastermindtable.slice();

        newMastermindTable[circleRowIdx] = theCircleRow;

        this.setState({
            mastermindtable: newMastermindTable
        });

    }
    getRandomIdx(low, high) {

            return Math.floor(Math.random() * (high - low + 1) + low);
    }
    render() {
        return (
            <div className="Mastermind">
                <StatusRow statusCircle={this.state.statusCircle}/>
                <div style={{height: "400px"}}>&nbsp;</div>
                <MastermindTable  mastermindArray={this.state.mastermindArray} feedbackArray={this.state.feedbackArray} statusCircle={this.state.statusCircle} handleCircleColorChange={this.handleCircleColorChange}/>
                <Palette paletteColors={this.paletteColors} selectedPaletteCircle={this.selectedPaletteCircle} />              
            </div>
        )

    }
}

export default Mastermind;
