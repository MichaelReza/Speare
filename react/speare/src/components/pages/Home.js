import React from 'react';
import '../../App.css';
import './css/Home.css';
import Cameron from '../../assets/images/devs/cameron.png';
import Megan from '../../assets/images/devs/megan.jpg';
import Michael from '../../assets/images/devs/michael.png';
import Andrew from '../../assets/images/devs/andrew.jpg';
import Caitlin from '../../assets/images/devs/caitlin.jpg';
import Damian from '../../assets/images/devs/damian.jpg';
import Navbar from '../Navbar';

function Home() {
  return (
    <div className="home">
      <Navbar/>
      <div className="home-container">
        <div className="home-section">
          <h1>about speare</h1>
          <p>
          Speare is an elegant, high level, statically typed scripting language which transpiles to JavaScript. The goal of
          Speare is to bring high class English terminology to the world of Computer Science. The language has been developed
          by six Computer Science majors at Loyola Marymount University in 2021 as a part of our Compilers course. Speare is
          widely known for having the best logo in the history of computer language logos.
          </p>
        </div>
        <div className="home-section">
          <h2>our inspiration</h2>
          <p>
          Our language is heavily inspired by Shakespearean language used in the 16th century. phrases such as "speaketh," "Corollary,"
          "Composition," are a result of us finding synonyms for the more basic phrasing used today. We even used a Shakespearean word 
          generator early on! We also took inspiration from Shakespeare's usage of the word "enter" for function headers. Speare also draws
          comparisons to Java's form of explicit type declarations when creating variables. We love to highlight our extremely intuitive way 
          to declare nested Arrays: "alloweth Liste of Liste of Liste of Liste of Liste of Numeral foo be [[[[[9, 6]]]]]" is just so simple yet
          so expressive, just how Shakespeare would have wanted it to be.
          </p>
        </div>
        <div className="home-section">
          <h2>speare technology</h2>
          <p>
          Speare utilizes the Ohm language to create the Speare grammar. The language features several useful features such as nesting functions, classes,
          arrays, and dictionaries, as well as loop nesting. Speare also follows the JavaScript model of declaring all numbers to be of one type, rather than
          splitting them up into various float and integer types. The language also optimizes code in several ways.
          </p>
        </div>
        <div className="home-section">
          <h2>meet the developers</h2>
          <div className="dev-container">
            <div className="dev-row">
              <div className="dev-card">
                <div className="dev-photo">
                  <img src={Cameron}></img>
                </div>
                <div className="dev-info">
                  <h3>Cameron Gould</h3>
                  <h4>Author, Web Developer</h4>
                  <p>
                  Cameron championed the Speare grammar, heavily contributed to the development of the parser, and assisted in the development of the analyzer, generator, and optimizer.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/gouldcs" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/in/cameron-gould/" target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </div>
              </div>
              <div className="dev-card">
                <div className="dev-photo">
                  <img src={Megan}></img>
                </div>
                <div className="dev-info">
                  <h3>Megan Reyes</h3>
                  <h4>Author</h4>
                  <p>
                  Megan contributed to the development of the parser, and helped resolve testing issues with the Speare analyzer.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/meganreyes" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/in/megan-reyes/" target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="dev-row">
              <div className="dev-card">
                <div className="dev-photo">
                  <img src={Michael}></img>
                </div>
                <div className="dev-info">
                  <h3>Michael Reza</h3>
                  <h4>Author</h4>
                  <p>
                  Michael heavily contributed to developing the analyzer, helped optimize the Speare grammar, and assisted in the development of the parser, generator, and optimizer.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/MichaelReza" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/in/michael-reza-8359a0194/" target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </div>
              </div>
              <div className="dev-card">
                <div className="dev-photo">
                  <img src={Andrew}></img>
                </div>
                <div className="dev-info">
                  <h3>Andrew Rossell</h3>
                  <h4>Author</h4>
                  <p>
                  Andrew contributed to development of the parser and optimizer, while heavily contributing to the development of the analyzer.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/arossell111" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/in/andrew-rossell-18094a193/" target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="dev-row">
              <div className="dev-card">
                <div className="dev-photo">
                  <img src={Caitlin}></img>
                </div>
                <div className="dev-info">
                  <h3>Caitlin Colina</h3>
                  <h4>Author</h4>
                  <p>
                  Caitlin contributed to the development of the parser, and helped resolve testing issues with the Speare analyzer.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/caitlincolina" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/in/caitlin-colina-740916194/" target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </div>
              </div>
              <div className="dev-card">
                <div className="dev-photo">
                  <img src={Damian}></img>
                </div>
                <div className="dev-info">
                  <h3>Damián Browne</h3>
                  <h4>Author, Web Developer</h4>
                  <p>
                  Damián heavily contributed to developing the analyzer, helped optimize the Speare grammar,
                  and assisted in the development of the parser, generator, and optimizer.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/damianbrowne" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/in/damianbrowne/" target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-butt-container">
            <div className="home-butt">
                <a href="https://github.com/MichaelReza/Speare" target="_blank" rel="noreferrer">
                  explore our documentation
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;