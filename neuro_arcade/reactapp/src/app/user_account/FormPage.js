import {GameForm} from "../../components/add_content/GameForm";
import styles from "../../styles/App.module.css";
import {Banner, MobileBanner} from "../../components/Banner";
import {NavBar} from "../../components/NavBar";
import {motion} from "framer-motion";
import {ModelForm} from "../../components/add_content/ModelForm";
import {ScoreForm} from "../../components/add_content/ScoreForm";
import {Button} from "../../components/Button";
import {useParams} from "react-router-dom";
import {GameUpdateForm} from "../../components/add_content/UpdateGameForm";
import {ModelUpdateForm} from "../../components/add_content/UpdateModelForm";

/**
 * @returns {JSX.Element} add game page
 * @constructor builds add game page
 */
export function FormPage({type}) {
    let nav_left = (
        <Button
            name={"back"}
            link={-1}
            orientation={"left"}
            direction={"left"}
        />
    );

    let form;
    let title;
    if (type === "game") {
        form = <GameForm />;
        title = "Add Game";
    } else if (type === "model") {
        form = <ModelForm />;
        title = "Add Model";
    } else if (type === "gameUpdate") {
        form = <GameUpdateForm />;
        title = "Update Game";
    } else if (type === "modelUpdate") {
        form = <ModelUpdateForm />;
        title = "Update Player";
    } else if (type === "score") {
        form = <ScoreForm />;
        title = "Upload Score";
    } else {
        throw "invalid form type";
    }

    return (
        <>
            {type === "game" || type === "model" ? <Banner size={"big"} left={nav_left} /> : <Banner size={"small"} left={nav_left} selected={type === "modelUpdate" ? "Players" : "Games"} />}
            <MobileBanner />
            <NavBar left={nav_left} />
            <motion.div className={styles.MainBlock} id={styles[type === "game" || type === "model" ? "big" : "small"]} initial={{opacity: 0}} animate={{opacity: 1}}
                        exit={{opacity: 0}}>
                <div className={styles.Form}>
                    <h1 className={styles.Header}>{title}</h1>
                    {form}
                </div>
                <div className={styles.MobileBannerBuffer}/>
            </motion.div>
        </>
    );
}
