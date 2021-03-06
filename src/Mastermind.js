import React, { Component } from 'react';
import './Mastermind.css';

const red = require('./images/redCircle.png');
const blue = require('./images/blueCircle.png');
const green = require('./images/greenCircle.png');
const purple = require('./images/purpleCircle.png');
const teal = require('./images/tealCircle.png');
const magenta = require('./images/magentaCircle.png');
const emptyCircle = require('./images/emptyCircle.png');
const transparentCircle = require('./images/transparentCircle.png');

//Board Size for Mastermind table
const NUM_ROWS = 8, NUM_COLS = 5;

let uniqueSeed = 0;
function nextUniqueKey() {
    return uniqueSeed += 1;
} //This is needed in order for multiple iterations of the rendering. Necessary for React, but not my purposes. 

class ColorsToGuess extends Component {
    render() {
        console.log('inside Colors To Guess');
        return (
            <table className="palette_circles">
                <tbody>
                    <tr>
                        <td><img className="large_circle" src={this.props.colorsToGuess[0].color} alt={this.props.colorsToGuess[0].colorName} /></td>
                        <td><img className="large_circle" src={this.props.colorsToGuess[1].color} alt={this.props.colorsToGuess[1].colorName} /></td>
                        <td><img className="large_circle" src={this.props.colorsToGuess[2].color} alt={this.props.colorsToGuess[2].colorName} /></td>
                        <td><img className="large_circle" src={this.props.colorsToGuess[3].color} alt={this.props.colorsToGuess[3].colorName} /></td>
                    </tr>
                </tbody>
            </table>

        );
    }
}
class StatusRow extends Component {

    render() {
        let color = this.props.statusCircle.color;
        let colorName = this.props.statusCircle.colorName;
        console.log('Inside status row. color is: ', colorName);
        return (
            <table className="status_circles">
                <tbody>
                    <tr><td><img className="large_circle" src={red} alt="Red Circle" onClick={this.props.reset} /></td>
                        <td><img className="large_circle" src={color} alt={colorName} /></td></tr>
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
        // console.log('circle is:', this.props.circle);
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
        let feedback = this.props.feedback;
        return (
            <tr>
                {this.props.row.map((circle, idx) =>
                    <Circle onClick={() => this.props.checkGussedCircles(this.props.row)} key={nextUniqueKey()}
                        circleIdx={idx} circle={circle} selectedPaletteCircle={this.props.selectedPaletteCircle}
                        handleCircleColorChange={this.props.handleCircleColorChange} />)}
                <td className="feedback_cell"> {feedback ? this.feedbackCircles(feedback) : ""}</td>
            </tr>);
    }
}
class MastermindTable extends Component {

    render() {
        return (

            <table className="board_table">
                <tbody>{
                    this.props.mastermindtable.map((row) =>
                        <MastermindTableRow key={nextUniqueKey()}
                            row={this.props.mastermindArray} statusCircle={this.props.statusCircle}
                            feedback={this.props.feedback} handleCircleColorChange={this.props.handleCircleColorChange}
                            colorsToGuess={this.props.colorsToGuess} checkGussedCircles={this.props.checkGussedCircles} />)
                }

                </tbody>
            </table>
        );
    }

}
class Mastermind extends Component {

    paletteColors = [
        { color: green, colorName: 'Green' },
        { color: teal, colorName: 'Teal' },
        { color: magenta, colorName: 'Magenta' },
        { color: blue, colorName: 'Blue' },
        { color: red, colorName: 'Red' },
        { color: purple, colorName: 'Purple' }
    ];

    nonFilledCircle = {
        color: emptyCircle,
        colorName: 'Empty circle'
    };

    feedbackCircle = {
        color: transparentCircle,
        colorName: 'Transparent Circle',

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

        let activeRowFeedback = [
            this.feedbackCircle,
            this.feedbackCircle,
            this.feedbackCircle,
            this.feedbackCircle
        ];

        let colorsToGuess = [
            this.paletteColors[this.getRandomIdx(0, 5)],
            this.paletteColors[this.getRandomIdx(0, 5)],
            this.paletteColors[this.getRandomIdx(0, 5)],
            this.paletteColors[this.getRandomIdx(0, 5)]
        ];

        //Mastermind Table Initialization
        let mastermindtable = Array(NUM_ROWS).fill(Array(NUM_COLS).fill({ cirlce: this.nonFilledCircle }));
        mastermindtable.map((row, rowIdx) => row.map((col, colIdx) => {
            return { ...mastermindtable[rowIdx][colIdx], row: rowIdx, col: colIdx }

        }));


        console.log('mastermindtable is:', mastermindtable);
        this.state = {
            mastermindtable,
            mastermindArray: activeRow,
            feedbackArray: activeRowFeedback,
            colorsToGuessArray: colorsToGuess,
            statusCircle: { color: emptyCircle, colorName: 'Empty circle' },
            currentRow: 0,
            gameWon: false
        }

        console.log('mastermind array is: ', this.state.mastermindArray)
        console.log('colorsToGuessArray is:', this.state.colorsToGuessArray);


        this.selectedPaletteCircle = this.selectedPaletteCircle.bind(this);
        this.handleCircleColorChange = this.handleCircleColorChange.bind(this);
        this.checkGussedCircles = this.checkGussedCircles.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        //Don't need this for part 
    }

    selectedPaletteCircle(circle) {
        console.log('selected a palette color', circle.colorName);
        this.setState({ statusCircle: circle });
    }

    handleCircleColorChange(circleIdx) {
        //Just outputting to console for checking.
        console.log('inside handleCircleColorChange function');
        console.log('coldIdx is:', circleIdx);
        console.log('clicked circle is', this.state.mastermindArray[circleIdx]);
        console.log('status circle is', this.state.statusCircle);

        let circleRowIdx = this.state.mastermindArray[circleIdx];
        let theCircleRow = this.state.mastermindArray.slice();
        let row = this.state.currentRow;


        theCircleRow[circleIdx] = this.state.statusCircle;
        let clickedCircle = theCircleRow[circleIdx];
        console.log('clicked circle is now: ', clickedCircle);

        let newMastermindTable = this.state.mastermindtable.slice();

        newMastermindTable[circleRowIdx] = theCircleRow;
        console.log('the CircleRow is', theCircleRow)



        const checkRow = this.checkGussedCircles(theCircleRow);
        console.log(this.checkGussedCircles(theCircleRow));

        if (checkRow.gameWon === true) {
            this.setState({
                mastermindArray: theCircleRow,
                mastermindtable: newMastermindTable,
            });
            alert('You Won!');
            console.log('gameWon is true')
        }

        else if (checkRow.gameWon === false) {
            console.log('currentRow is: ', row);
            console.log('game won is false');

            this.setState({
                mastermindArray: theCircleRow,

                mastermindtable: newMastermindTable,
            });

        }


        console.log('feedBackArray is:', this.state.feedbackArray)
    }

    reset() {
        let mastermindtable = Array(NUM_ROWS).fill(Array(NUM_COLS).fill({ cirlce: this.nonFilledCircle }));
        mastermindtable.map((row, rowIdx) => row.map((col, colIdx) => {
            return { ...mastermindtable[rowIdx][colIdx], row: rowIdx, col: colIdx }

        }));

        let feedbackArray = [
            this.feedbackCircle,
            this.feedbackCircle,
            this.feedbackCircle,
            this.feedbackCircle
        ];

        let activeRow = [
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle,
        ];

        let colorsToGuess = [
            this.paletteColors[this.getRandomIdx(0, 5)],
            this.paletteColors[this.getRandomIdx(0, 5)],
            this.paletteColors[this.getRandomIdx(0, 5)],
            this.paletteColors[this.getRandomIdx(0, 5)]
        ];

        console.log('mastermindtable is:', mastermindtable);

        this.setState({
            mastermindtable,
            mastermindArray: activeRow,
            feedbackArray: feedbackArray,
            colorsToGuessArray: colorsToGuess,
            statusCircle: { color: emptyCircle, colorName: 'Empty circle', visible: true },
            gameWon: false
        });

    }
    checkGussedCircles(guessedArray) {
        console.log('inside checkGuessedCircles');
        let keyArray = JSON.parse(JSON.stringify(this.state.colorsToGuessArray));

        let newFeedbackArray = this.state.feedbackArray;

        console.log('guessedArray is:', guessedArray);
        console.log('keyArray is:', keyArray);

        let numRedCircles = 0;
        let numEmptyCircles = 0;
        console.log('newFeedBackArray before state change: ', newFeedbackArray);

        //Checking for correct color and position.
        for (let i = 0; i < guessedArray.length; i++) {
            if (guessedArray[i].colorName === keyArray[i].colorName) {
                numRedCircles += 1;
                keyArray[i] = {
                    color: undefined,
                    colorName: undefined
                }
            }
        }
        console.log('keyArray is:', keyArray);

        //Checking for correct color
        for (let j = 0; j < guessedArray.length; j++) {
            if (keyArray.find(color => (color.colorName !== undefined) && (color.colorName === guessedArray[j].colorName))) {
                numEmptyCircles += 1;
            }
        }

        console.log('newFeedbackArray after state change is: ', newFeedbackArray);
        for (let r = 0; r < numRedCircles; r++) {
            newFeedbackArray[r] = {
                color: red,
                colorName: 'Red Circle'
            }
        }

        for (let e = 0; e < numEmptyCircles; e++) {
            if (e.colorName !== 'Red Circle') {
                newFeedbackArray[e + numRedCircles] = {
                    color: emptyCircle,
                    colorName: 'Empty Circle'
                }
            }
        }

        console.log('numEmptyCircles is: ', numEmptyCircles);

        if (numRedCircles === 4) {
            return {
                gameWon: true,
                feedbackArray: newFeedbackArray
            }
        }
        else {
            return {
                gameWon: false,
                feedbackArray: newFeedbackArray
            }
        }
    }


    getRandomIdx(low, high) {

        return Math.floor(Math.random() * (high - low + 1) + low);
    }


    render() {
        return (
            <div className="Mastermind">
                <StatusRow statusCircle={this.state.statusCircle} reset={this.reset} />
                <ColorsToGuess colorsToGuess={this.state.colorsToGuessArray} />
                <MastermindTable key={nextUniqueKey()} mastermindtable={this.state.mastermindtable} mastermindArray={this.state.mastermindArray} feedback={this.state.feedbackArray} statusCircle={this.state.statusCircle} handleCircleColorChange={this.handleCircleColorChange} checkGussedCircles={this.checkGussedCircles} colorsToGuess={this.state.colorsToGuessArray} />
                <Palette paletteColors={this.paletteColors} selectedPaletteCircle={this.selectedPaletteCircle} />
            </div>
        )
    }
}

export default Mastermind;