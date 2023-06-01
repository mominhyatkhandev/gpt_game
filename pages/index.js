import Img from "react-cool-img";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import ClipLoader from "react-spinners/ClipLoader";

const inter = Inter({ subsets: ["latin"] });

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [optionLoader, setOptionLoader] = useState(false);
  const [isOptionError, setOptionError] = useState(false);
  const [classArray, setClassArray] = useState([]);
  const [optionArray, setOptionArray] = useState([]);
  const [description, setDescription] = useState("");
  const [descImg, setDescImg] = useState("");
  const [optionImg, setOptionImg] = useState([]);
  const [color, setColor] = useState("#ffff67");

  const [selectedOption, setSelectedOption] = useState(null);

  const apiKey = "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";

  // console.log("classes", classArray);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const loadingImage =
    "https://oaidalleapiprodscus.blob.core.windows.net/private/org-Itjqb8ec7Sd1phS2N3DbfZRC/user-5yybzeY11IowGqBI3rwjIfa3/img-FuZDgckoP1G1FZ7eGwoqJAB3.png?st=2023-06-01T07%3A04%3A09Z&se=2023-06-01T09%3A04%3A09Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-31T20%3A31%3A21Z&ske=2023-06-01T20%3A31%3A21Z&sks=b&skv=2021-08-06&sig=t2cmQwCfkqm0vJ4NIgsUVgdzBdJQOBP9l%2BX3Xfx0G%2Bw%3D";

  // "chose class VAR, Give me short texted options of what to do
  // A description of the surroundings
  // A description of the creature I encounter

  // Offer other options other than fighting

  // Response must be in JSON"

  // let options = [];
  let options = classArray?.map((option) => ({
    label: option,
    value: option,
  }));
  const data = {
    model: "text-davinci-003",
    prompt: `Let's roleplay together you are the dungeon master and I am the player. This is a fantasy world with mythical creatures like LOTR Offer short and captivating texts Give me 4 random classes to choose from. response in json`,
    temperature: 0,
    max_tokens: 60,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const textCompletion = async () => {
    console.log("textCompletion");
    setLoading(true);

    await axios
      .post("https://api.openai.com/v1/completions", data, {
        headers,
      })
      .then((response) => {
        // Extract the completed text from the response
        console.log("from response");
        console.log("RESPONSE: ", response);

        const completion = JSON.parse(response.data.choices[0].text).classes;
        setClassArray(completion);
        setLoading(false);
        // console.log(":", completion);
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false);
      });
    // setPromptText("");
  };

  const imageArray = [
    "https://static.pakwheels.com/2022/09/Ferrari-Purosangue-revealed-11-750x430.jpg",
    "https://static.pakwheels.com/2022/09/Ferrari-Purosangue-revealed-11-750x430.jpg",
    "https://static.pakwheels.com/2022/09/Ferrari-Purosangue-revealed-11-750x430.jpg",
  ];

  const optionSelected = async (optionData) => {
    console.log("optionSelected");
    // setLoading(true);
    setOptionLoader(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        optionData,
        {
          headers,
        }
      );

      console.log("from response");
      console.log("RESPONSE: ", response);
      // console.log("OPTION PROMPT TEXT", promptText);

      if (response.data.choices[0].text.options?.text) {
        console.log("RUNNING if BLOCK");
        const tempOpt = [];
        const option = JSON.parse(response.data.choices[0].text)?.options.map(
          (opt) => {
            tempOpt.push(opt.text);
          }
        );
        console.log("options: ", tempOpt);
        setOptionArray(tempOpt);

        // const desc = JSON.parse(response.data.choices[0].text)?.options.map((opt)=>{

        // });
        // console.log("desc: ", desc.description);
        // setDescription(desc.description);
      } else {
        console.log("RUNNING ELSE BLOCK");
        const option = JSON.parse(response?.data?.choices[0]?.text)?.options;
        console.log("options: ", option);
        setOptionArray(option);

        const desc = JSON.parse(response?.data?.choices[0]?.text)?.description;
        console.log("desc: ", desc);
        setDescription(desc);

        const imageDataDescription = {
          prompt: desc,
          n: 1,
          size: "1024x1024",
        };

        const tempOptionImg = [];
        option.map(async (opt) => {
          const optionDataDescription = {
            prompt: opt,
            n: 1,
            size: "1024x1024",
          };
          await axios
            .post(
              "https://api.openai.com/v1/images/generations",
              optionDataDescription,
              {
                headers,
              }
            )
            .then((response) => {
              console.log("OPTIONNN IMAGEEE DATAAA: ", response);
              tempOptionImg.push(response.data.data[0].url);
              // setDescImg(response.data.data[0].url);
            })
            .catch((error) => {
              console.error("Image Errorrr:", error);
            });
          setOptionImg(tempOptionImg);
        });

        console.log("imageDataDescription", imageDataDescription);

        await axios
          .post(
            "https://api.openai.com/v1/images/generations",
            imageDataDescription,
            {
              headers,
            }
          )
          .then((response) => {
            console.log("IMAGEEE DATAAA: ", response);
            setDescImg(response.data.data[0].url);
          })
          .catch((error) => {
            console.error("Image Errorrr:", error);
          });
      }

      // setLoading(false);
      setOptionLoader(false);
    } catch (e) {
      setOptionLoader(false);
      setOptionError(true);
      console.log("Errorr:", e);
    }

    // .then((response) => {
    //   // Extract the completed text from the response
    // })
    // .catch((error) => {
    // });
    // setPromptText("")
  };
  console.log("OPTION ARRAY", optionArray);
  console.log("DESCRIPTION STATE", description);

  // console.log("SELECT OPTION: ", selectedOption);

  return (
    <main
      className={`flex flex-col items-center justify-between p-24 ${inter.className} space-y-4`}
    >
      {loading ? (
        <div>
          <ClipLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          loading...
        </div>
      ) : (
        <>
          <button
            className="bg-slate-50 p-3 rounded-md w-1/2"
            onClick={() => textCompletion()}
          >
            get data
          </button>
          {classArray.length > 0 && (
            <div className="p-2 w-full flex flex-col space-y-4 bg-blue-50 rounded-md justify-center items-center">
              <label htmlFor="selectOption" className="font-semibold">
                Select a class
              </label>
              <Select
                className="w-1/2"
                id="selectOption"
                defaultValue={selectedOption}
                onChange={(selectedOption) => setSelectedOption(selectedOption)}
                options={options}
              />
              {selectedOption && (
                <button
                  className="p-2 border rounded-md bg-slate-50"
                  onClick={() => {
                    console.log(`I Chose, ${selectedOption.value}. Give m`);

                    // setPromptText(
                    //   `I Chose, ${selectedOption.value}. Give me short texted following options of what to do`
                    // );
                    optionSelected({
                      model: "text-davinci-003",
                      prompt: `I chose ${selectedOption}. Give me short texted options of what to do along its description. response in json with options and description as key value`,
                      temperature: 0,
                      max_tokens: 60,
                      top_p: 1,
                      frequency_penalty: 0,
                      presence_penalty: 0,
                    });
                  }}
                >
                  send
                </button>
              )}
            </div>
          )}
          {/* A description of the creature I encounter */}
          {optionLoader ? (
            <div>
              <ClipLoader
                className="mt-10"
                color={color}
                loading={loading}
                cssOverride={override}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              loading...
            </div>
          ) : isOptionError ? (
            <div className="text-red-500 font-semibold">
              Something Went Wrong!
            </div>
          ) : (
            <>
              {description && (
                <>
                  <Img
                    placeholder="/loading-svg.svg"
                    src={descImg}
                  />
                  {/* <div class="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                    
                  </div> */}
                  <div className="p-2 border bg-slate-100">{description}</div>
                </>
              )}

              {optionArray?.length > 0 &&
                optionArray.map((opt, i) => {
                  return (
                    <>
                      <div className="mt-4 ">
                        <Img
                          className="h-auto max-w-sm"
                          placeholder="/loading-svg.svg"
                          alt="loading..."
                          src={optionImg[i]}
                        />
                        {/* <img src={imageArray[i]}></img> */}
                      </div>
                      <div
                        className="p-2 w-1/2 rounded-md bg-slate-300 text-center cursor-pointer"
                        key={i}
                        onClick={() =>
                          optionSelected({
                            model: "text-davinci-003",
                            prompt: `I chose ${opt}. Give me short texted options of what to do and A description of the surroundings, response in json with options and description as key value`,
                            temperature: 0,
                            max_tokens: 60,
                            top_p: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                          })
                        }
                      >
                        {opt}
                      </div>
                    </>
                  );
                })}
            </>
          )}
        </>
      )}
    </main>
  );
}

// const [promptText, setPromptText] = useState<
//   HTMLInputElement | undefined | string
// >();

// const handlePrompt = (e: any) => {
//   const { name, value } = e.target;
//   setPromptText(value);
// };

{
  /* <div className="w-1/2 p-2">
<label>PROMPT HERE:</label>
<input
className="p-2"
type="text"
value={promptText}
onChange={(e) => handlePrompt(e)}
/>
</div> */
}
