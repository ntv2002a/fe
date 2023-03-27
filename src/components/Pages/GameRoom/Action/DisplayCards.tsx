import React from "react"
import { Card } from "../../../../type"
import { Row, Col } from 'react-bootstrap'
interface DisplayCardsProps {
    //true is your, false is not
    cards: Card[]
}
export const DisplayCards = (props: DisplayCardsProps) => {
    const [results, setResults] = React.useState<JSX.Element[]>([]);

    const mapCardToJSX = (card: Card): JSX.Element => {
        return (
            <Col lg = '2'>
                <img style = {{position: 'relative', width: '100%', margin: '0 1rem 0 1rem'}} alt={card.cardName + ' ' + card.suit + '.png'} src={'asset/card/' + card.cardName + ' ' + card.suit + '.png'} />
            </Col>
        )
    }

    React.useEffect(() => {
        const assignResults: JSX.Element[] = []
        props.cards.forEach((card: Card) => {
            assignResults.push(mapCardToJSX(card));
        })
        setResults(assignResults);
    }, [props.cards])

    return (
        <div className='DisplayCard'>
            <Row style = {{position: 'relative'}}>
                {results}
            </Row>
        </div>
    )
}