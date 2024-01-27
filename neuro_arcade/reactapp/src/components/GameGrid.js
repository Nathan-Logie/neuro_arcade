import styles from '../styles/GameGrid.module.css'
import {GameCard} from "./GameCard";
import {requestGamesSorted} from "../backendRequests";
import {useEffect, useState} from "react";

export function GameGrid({query, num, linkPrefix, id}) {
    let [isLoading, setLoading] = useState(true);
    let [games, setGames] = useState({});

    // If query has changed, fetch games from server
    // TODO: consider filtering on client side
    useEffect(() => {
        requestGamesSorted(query)
            .then(g => {
                setGames(g);
                setLoading(false);
            })
    }, [query]);

    // Display waiting message while waiting on server, then show games
    if (isLoading) {
        return (
            <div className={styles.GameGrid}>
                Loading...
            </div>
        )
    } else {
        return (
            <div className={styles.GameGrid} id={styles[id]}>
                {games.map((game, index) => (
                    <GameCard
                        key={index}
                        game={game}
                        linkPrefix={linkPrefix}
                    />
                ))}
            </div>
        );
    }
}