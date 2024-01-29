import {useLocation, useParams} from "react-router-dom";
import {requestGame, requestGamesSorted} from "../backendRequests";
import styles from "../styles/App.module.css";
import {Table} from "../components/Table";
import {Graph} from "../components/Graph";
import {useEffect, useState} from "react";
import {Banner, MobileBanner} from "../components/Banner";
import {Background} from "../components/Background";


export function GameView() {
    // see: https://reactrouter.com/en/main/start/concepts#data-access
    let gameSlug = useParams().game_slug;
    let [isLoading, setLoading] = useState(true);
    let [gameData, setGameData] = useState({});
    useEffect(() => {
        requestGame(gameSlug)
            .then(g => {
                setGameData(g);
                setLoading(false);
            })
    }, []);
    if (isLoading) {
        return (
            <div className={styles.MainBlock}>
                Loading...
            </div>
        )
    } else {
        return (
            <div>
                <Background />
                <Banner size={'small'} />
                <MobileBanner size={'small'} />
                <div className={styles.MainBlock}>
                    <div className={styles.Content}>
                        <h1>{gameData.game.name}</h1>
                        <div className={styles.ContentBlock}>
                            <img src="https://loremflickr.com/500/500"  alt={'image'} // TODO add query for image here
                                />
                            <p>{gameData.game.description}</p>
                        </div>
                    </div>
                    <div className={styles.Side}>
                        <Table inputData={gameData}/>
                    </div>
                    <Graph inputData={gameData}/>
                </div>
            </div>

        )
    }
}