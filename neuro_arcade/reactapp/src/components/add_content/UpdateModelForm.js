import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FaImage, FaTrash} from "react-icons/fa6";
import CreatableSelect from "react-select/creatable";
import {requestPlayerTags, getUser, getHeaders, API_ROOT, requestPlayer} from "../../backendRequests";
import slugify from "react-slugify";
import makeAnimated from "react-select/animated";
import {MAX_DESCRIPTION_LENGTH_MODEL, MAX_NAME_LENGTH_MODEL, IMAGE_EXTENSION} from "./formHelper";
import {useNavigate, useParams} from "react-router-dom";
import {updatePlayer} from "../../backendRequests";
import {FaSave} from "react-icons/fa";
import {GrPowerReset} from "react-icons/gr";

const customStyles = {
    option: (provided) => ({...provided, color: "white"}),
    control: (provided) => ({
        ...provided,
        color: "black",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        border: "none",
        borderRadius: "0.5em",
        marginBottom: "1em"
    }),
    valueContainer: (provided) => ({...provided, height: "max-content"}),
    placeholder: (provided) => ({
        ...provided,
        color: "#CCCCCC",
        textAlign: "left",
        fontSize: "0.9em",
        paddingLeft: "1em"
    }),
    input: (provided) => ({...provided, color: "#FFFFFF", paddingLeft: "1em", fontSize: "0.9em"}),
    multiValue: (provided) => ({...provided, backgroundColor: "rgba(0,0,0,0.2)", color: "white", borderRadius: "0.5em"}),
    multiValueLabel: (provided) => ({...provided, color: "white"}),
    multiValueRemove: (provided) => ({...provided, borderRadius: "0.5em"}),
    menu: (provided) => ({...provided, borderRadius: "0.5em", position: "relative"})
};

/**
 * @returns {JSX.Element} update existing model form
 * @constructor builds update existing model form
 */
export function ModelUpdateForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, touchedFields},
        setError,
        reset
    } = useForm();

    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [tags, setTags] = useState([]);
    let [existingTags, setExistingTags] = useState([]);
    let [options, setOptions] = useState([]);
    let [image, setImage] = useState(null);
    let player_name = useParams().player_slug;
    let [loading, setLoading] = useState(true);
    let [currentValues, setCurrentValues] = useState(null);
    let [header, setHeader] = useState(null);
    let [imageURL, setImageURL] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        requestPlayer(player_name).then((currentData) => {
            setCurrentValues(currentData);
            setImageURL(`${API_ROOT}/${currentData.icon}`);
            getHeaders("PATCH", true).then((header) => {
                setHeader(header);
                requestPlayerTags().then((tags) => {
                    setExistingTags(tags);
                    setLoading(false);
                });
            });
        });
    }, []);

    existingTags.forEach((tag) => {
        options.push({
            value: tag.id,
            label: tag.name
        });
    });
    options.forEach((option) => {
        if (currentValues.tags.includes(option.value)) {
            tags.push(option);
        }
    });

    function handleTagReset() {
        setTags([]);
        options.forEach((option) => {
            if (currentValues.tags.includes(option.value)) {
                tags.push(option);
            }
        });
    }

    function handleReset() {
        reset({
            name: currentValues.name,
            description: currentValues.description
        });
        setName("");
        setDescription("");
        setImageURL(`${API_ROOT}/${currentValues.icon}`);
        setImage(null);
        handleTagReset();
    }

    const handleImage = (event) => {
        const file = event.target.files[0];
        const acceptedFormats = IMAGE_EXTENSION;
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("root", {message: "Invalid file type provided"});
            setImage(null);
        } else {
            setImage(file);
        }
    };

    async function handleCreate(tagName) {
        let formData = new FormData();
        let url = `${API_ROOT}/api/playerTag/`;

        formData.append("name", tagName);
        formData.append("slug", slugify(tagName));
        formData.append("description", "default description");
        await axios
            .post(url, formData, header)
            .then((response) => {
                console.log(response);
                let newValue = {
                    value: response.data.id,
                    label: response.data.name
                };
                setOptions((prev) => [...prev, newValue]);
                setTags((prev) => [...prev, newValue]);
            })
            .catch(() => {
                setError("tags", {message: "Error creating new tag"});
            });
    }

    function handleDelete() {
        if (currentValues.user !== getUser().id && !getUser().is_admin) {
            setError("root", {
                message: "You do not have permissions to edit this player"
            });
            return;
        }

        let url = `${API_ROOT}/api/players/${currentValues.id}/`;
        axios
            .delete(url)
            .then((response) => {
                navigate("/all_players/");
            })
            .catch(() => {
                setError("root", {
                    message: "Could not delete player"
                });
            });
    }

    const onUpdate = async () => {
        if (currentValues.user !== getUser().id && !getUser().is_admin) {
            setError("root", {
                message: "You do not have permissions to edit this player"
            });
            return;
        }

        let formData = new FormData();
        if (name !== "") {
            formData.append("name", name);
            formData.append("slug", slugify(name));
        }
        if (description !== "") {
            formData.append("description", description);
        }

        if (image) {
            formData.append("icon", image);
        }

        if (formData.entries().next().done && tags.length === 0) {
            setError("root", {
                message: "No changes detected"
            });
            return;
        }

        await updatePlayer(player_name, formData)
            .then(function (response) {
                if (tags.length !== 0) {
                    const finalTagIDs = tags.map((tag) => tag.value);
                    formData.append("tags", finalTagIDs);
                    let url = `${API_ROOT}/api/players/${response.data.id}/add_tags/`;
                    axios.post(url, formData, header).catch((response) => {
                        console.log(response);
                        setError("root", {message: "Error during tag change"});
                    });
                }
                reset();
                setImage(null);
                setError("root", {message: "player updated successfully"});
                setTags(null);
                if (name === "") {
                    navigate(`/all_players/${currentValues.slug}`);
                } else {
                    navigate(`/all_players/${slugify(name)}`);
                }
            })
            .catch(function (response) {
                if (!response) {
                    setError("root", {message: "No response from server"});
                } else {
                    if (response.response.data.slug) {
                        setError("root", {message: "A player with that name already exists!"});
                        return;
                    } else if (response.response.data.tags) {
                        setError("root", {message: "Tag upload failed"});
                        return;
                    }
                    if (response)
                        if (response.response.data.includes("IntegrityError")) {
                            setError("root", {message: "A player with that name already exists!"});
                        } else {
                            setError("root", {
                                message: `Something went wrong... ${response.response.data}`
                            });
                        }
                }
            });
    };

    if (!loading) {
        return (
            <form>
                <h3> Name </h3>
                <input
                    {...register("name", {
                        maxLength: {
                            value: MAX_NAME_LENGTH_MODEL,
                            message: `Maximum player title length has been exceeded (${MAX_NAME_LENGTH_MODEL})`
                        }
                    })}
                    type={"text"}
                    placeholder={"player name"}
                    defaultValue={currentValues.name}
                    onChange={(event) => setName(event.target.value)}
                />
                {errors.name && <div>{errors.name.message}</div>}

                <h3>Description</h3>
                <input
                    {...register("description", {
                        maxLength: {
                            value: MAX_DESCRIPTION_LENGTH_MODEL,
                            message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH_MODEL})`
                        }
                    })}
                    type={"text"}
                    placeholder={"This player measures..."}
                    defaultValue={currentValues.description}
                    onChange={(event) => setDescription(event.target.value)}
                />
                {errors.description && <div>{errors.description.message}</div>}

                <h3>Player Tags</h3>
                <CreatableSelect
                    isClearable
                    isMulti
                    defaultValue={currentValues.tags}
                    onChange={(newValue) => setTags(newValue)}
                    onCreateOption={handleCreate}
                    value={tags}
                    options={options}
                    components={makeAnimated()}
                    styles={customStyles}
                    placeholder={"Search..."}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary25: "rgba(255,255,255,0.3)",
                            primary: "white",
                            neutral0: "rgba(255, 255, 255, 0.1)",
                            neutral20: "white",
                            neutral40: "#BBBBBB",
                            neutral60: "#CCCCCC",
                            neutral80: "#AAAAAA",
                            primary50: "rgba(209,64,129,0.3)"
                        }
                    })}
                />
                {errors.tags && <div>{errors.tags.message}</div>}

                <span>
                    <div>
                        <h3>Player Icon</h3>
                        <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                            <label htmlFor={"icon"}>
                                <p>{image ? image.name : "No file chosen"}</p>
                                <div>
                                    <FaImage />
                                </div>
                            </label>
                            <input
                                id={"icon"}
                                {...register("icon", {
                                    required: false
                                })}
                                type={"file"}
                                accept={"image/*"}
                                onChange={handleImage}
                            />
                        </motion.div>
                        <h3>Current image</h3>
                        <img src={imageURL} alt='icon' />
                    </div>
                </span>

                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={handleSubmit(onUpdate)}>
                    {"save"}
                    <div>
                        <FaSave />
                    </div>
                </motion.button>
                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={handleSubmit(handleReset)}>
                    {"reset"}
                    <div>
                        <GrPowerReset />
                    </div>
                </motion.button>
                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={handleSubmit(handleDelete)}>
                    {"delete"}
                    <div>
                        <FaTrash />
                    </div>
                </motion.button>
                {errors.root && <div>{errors.root.message}</div>}
            </form>
        );
    } else {
        return <div>Loading...</div>;
    }
}
