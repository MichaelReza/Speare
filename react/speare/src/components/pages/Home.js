import React from 'react';
import '../../App.css';
import './css/Home.css';
import Cameron from '../../assets/images/devs/cameron.png';
import Megan from '../../assets/images/devs/megan.jpg';
import Michael from '../../assets/images/devs/michael.jpg';
import Andrew from '../../assets/images/devs/andrew.jpg';
import Caitlin from '../../assets/images/devs/caitlin.jpg';
import Damian from '../../assets/images/devs/damian.jpg';

function Home() {
  return (
    <div className="home">
      <div className="home-container">
        <div className="home-section">
          <h1>about speare</h1>
          <p>
          Speare is a computer language. You know that, I know that,
          we all know that. But what can we say here that will make
          anyone who visits our page say “ooooh that’s cool” because
          we know nothing that we say about the language will make
          them go “wow I really wanna use that now”
          </p>
        </div>
        <div className="home-section">
          <h2>our inspiration</h2>
          <p>
          Something about being an extremely complex language for
          absolutely no reason whatsoever other than the fact that
          we needed ideas.
          </p>
        </div>
        <div className="home-section">
          <h2>speare technology</h2>
          <p>
          This is what speare does. What does speare transpile to?
          How was speare built? Probably answer all of these questions
          at some point, but it’s too early for that. Go get a muffin,
          enjoy your life.
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
                  <h4>Author, Website Designer</h4>
                  <p>
                  Something about me creating stuff for the website and
                  language because we need to be pretentious and fill
                  all of the type space since it looks better that way.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/damianbrowne/" target="_blank" rel="noreferrer">Github</a>
                    <a href="https://github.com/damianbrowne/" target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </div>
              </div>
              <div className="dev-card">
                <div className="dev-photo">
                  <img src={Megan}></img>
                </div>
                <div className="dev-info">
                  <h3>Megan Reyes</h3>
                  <h4>Author, Website Designer</h4>
                  <p>
                  Something about me creating stuff for the website and
                  language because we need to be pretentious and fill
                  all of the type space since it looks better that way.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/meganreyes" target="_blank" rel="noreferrer">Github</a>
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
                  Something about me creating stuff for the website and
                  language because we need to be pretentious and fill
                  all of the type space since it looks better that way.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/damianbrowne/" target="_blank" rel="noreferrer">Github</a>
                    <a href="https://github.com/damianbrowne/" target="_blank" rel="noreferrer">LinkedIn</a>
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
                  Something about me creating stuff for the website and
                  language because we need to be pretentious and fill
                  all of the type space since it looks better that way.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/damianbrowne/" target="_blank" rel="noreferrer">Github</a>
                    <a href="https://github.com/damianbrowne/" target="_blank" rel="noreferrer">LinkedIn</a>
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
                  Something about me creating stuff for the website and
                  language because we need to be pretentious and fill
                  all of the type space since it looks better that way.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/caitlincolina" target="_blank" rel="noreferrer">Github</a>
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
                  Something about me creating stuff for the website and
                  language because we need to be pretentious and fill
                  all of the type space since it looks better that way.
                  </p>
                  <div className="dev-links">
                    <a href="https://github.com/damianbrowne" target="_blank" rel="noreferrer">Github</a>
                    <a href="https://www.linkedin.com/in/damianbrowne/" target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;