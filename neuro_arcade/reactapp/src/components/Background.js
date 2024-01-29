import styles from "../styles/Background.module.css"
import background from "../static/images/background.png"
export function Background() {
    return (
        <div>
            <img
                src={background}
                id={styles['hexagon']}
                alt={''}
            />
            <div className={styles.Gradient} />
        </div>
    );
}