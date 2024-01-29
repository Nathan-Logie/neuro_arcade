import {Banner, MobileBanner} from "../components/Banner";
import {Background} from "../components/Background";
import styles from "../styles/App.module.css"
import {GameGrid} from "../components/GameGrid";
import {useState} from "react";

export function AllGames() {
    let [query, setQuery] = useState('');
    //todo add a search bar
    return (
        <div>
            <Background/>
            <Banner size={'small'}/>
            <MobileBanner size={'small'} />
            <div className={styles.MainBlock}>
                <div className={styles.Content} id={styles['AllGames']}>
                    <h1>All Games</h1>
                    <GameGrid query={query} linkPrefix={''} id={'AppGrid'}/>
                </div>
            </div>
        </div>
    );
}