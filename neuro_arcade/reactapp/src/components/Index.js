import {Banner} from "./Banner";
import {GameCard} from "./GameCard";
import game_image from '../temp_static/images/game_icon.png'
import {GameGrid} from "./GameGrid";
import styles from '../styles/Index.module.css'
import {NavBar} from "./NavBar";
import {MobileBanner} from "./Banner";
import {Button} from "./Button";

function MoreGamesButton() {
    return (
        <Button
            className={styles.MoreGames}
            name={'More Games'}
            link={'...'} // TODO Django Link API
            orientation={'right'}
            direction={'down'}
        />
    );
}

export function Index() {
    let featuredGames = []; // TODO Django API for games
    
    // temporary featured game population
    for (let i = 0; i < 10; i++) {
        featuredGames.push(
            <GameCard
                name={'test game'}
                image={game_image}
                link={'...'}
            />
        )
    }

    return (
        <div>
            <Banner size={'big'} button_left={{
                name: 'About',
                link: '...', // TODO Django link API
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                name: 'Add Content',
                link: '...', // TODO Django link API
                orientation: 'right',
                direction: 'right'
            }} />
            <NavBar button_left={{
                name: 'About',
                link: '...', // TODO Django link API
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                name: 'Add Content',
                link: '...', // TODO Django link API
                orientation: 'right',
                direction: 'right'
            }}
            />
            <MobileBanner size={'big'} />
            <div className={styles.MainBlock}>
                <div className={styles.Content}>
                    <h1>Featured games</h1>
                    <GameGrid gameCardList={featuredGames} />
                    <Button
                        id={'MoreGames'}
                        name={'More Games'}
                        link={'...'} // TODO Django Link API
                        orientation={'right'}
                        direction={'down'}
                    />
                </div>
            </div>
            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}