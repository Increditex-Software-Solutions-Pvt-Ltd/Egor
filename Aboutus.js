import React from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import image4 from './image4.png'; // Import the image
import './AboutUs.css'; // Import the CSS file

const AboutPage = () => {
  return (
    <section id="about">
      <div className="about-page">
        <section className="about-section" id="about" data-aos="fade-up" data-aos-duration="1000">
          <h2>About Us</h2>
          <p>We are a leading HR consulting firm with a mission to transform HR processes and help businesses succeed.</p>
        </section>

        <section className="story-section" id="story" data-aos="fade-left" data-aos-duration="1000">
          <h2>The story of a <span className="journey">journey</span></h2>
          <p>The success of the Egor Group is fundamentally due to its systematic focus on two strategic areas: an unquestionable commitment to the quality of services and the creation of highly qualified work teams. The success of these guidelines led to Egor becoming, from 1996 onwards, the pioneering company in Quality Certification by APCER in the area of human resources services, and extending the same certification to all associated companies based on the international ISO 9000 standards. Over the years, it has received numerous institutional recognitions that attest to our focus on customer service.</p>
          <p>For over 30 years, the Egor Group has established itself as a trusted partner and a driving force in the development of our Clients' human assets and businesses.</p>
        </section>

        <section
                            className="history"
                            id="history"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                        >
                            <h2>The history of the journey</h2>
                            <p>The success of the Egor Group is fundamentally due to the systematic orientation in two vectors that are considered strategic: an unquestionable commitment to the quality of services and the construction of highly qualified work teams. The correctness of these guidelines led to Egor becoming, from 1996 onwards, the pioneer company in Quality Certification by APCER in the area of provision of human resources services and extending the same certification to all associated companies based on the standards ISO 9000 standards and, over the years, have received numerous institutional recognitions that attest to our orientation towards customer services. Other data you will get on the website about the specific dates.</p>
                        </section>

        <section className="stats-section" id="stats" data-aos="zoom-in" data-aos-duration="1000">
          <h2>Our Achievements</h2>
          <div className="stats-container">
            <motion.div className="stat-box" whileHover={{ scale: 1.1 }}>
              <h3>+500</h3>
              <p>Customers</p>
            </motion.div>
            <motion.div className="stat-box" whileHover={{ scale: 1.1 }}>
              <h3>+80</h3>
              <p>Millions of euros in turnover</p>
            </motion.div>
            <motion.div className="stat-box" whileHover={{ scale: 1.1 }}>
              <h3>+5000</h3>
              <p>Specialized talents recruited for our clients</p>
            </motion.div>
            <motion.div className="stat-box" whileHover={{ scale: 1.1 }}>
              <h3>+5000</h3>
              <p>Collaborators</p>
            </motion.div>
          </div>
        </section>

       


        <section className="social-responsibility-section" id="social-responsibility" data-aos="fade-up" data-aos-duration="1000">
          <h2>Social responsibility</h2>
          <div className="image-container">
            <a 
              href="https://open.spotify.com/show/6qs2WxKuCkGB1qUWU5zfSr" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img src={image4} alt="Social Responsibility" className="small-image" data-aos="zoom-in" data-aos-duration="1500" />
            </a>
          </div>
          <h3 data-aos="fade-up" data-aos-duration="1200">A Conversa Acontece | Podcast</h3>
          <p data-aos="fade-up" data-aos-duration="1400">“A Conversa Acontece” (A Talk Happens) is an initiative of “Egor Faz Acontecer” (Egor Makes it Happen) that aims to break down and clarify current issues in our society, in a conversation with guests.</p>
          <p data-aos="fade-up" data-aos-duration="1600">Welcome to our podcast!</p>
          <p data-aos="fade-up" data-aos-duration="1800">Egor consists of a group of companies, with 100% national share capital, in the area of human resources consultancy. Through its knowledge and structure acquired over more than 30 years, the social responsibility project, ‘Egor Makes it Happen’, was born. It seeks to help those who need it the most, aiming to create equitable conditions.</p>
        </section>
        <section
                            className="make-it-happen"
                            id="make-it-happen"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                        >
                            <h3>Make it Happen</h3>
                            <p>We seek to influence people and organizations, creating conditions for them to contribute with ideas and solutions to make things happen.</p>
                        </section>
        <section
                            className="ambition"
                            id="ambition"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                        >
                            <h3>Ambition</h3>
                            <p>We set ambitious yet achievable goals. We continually challenge ourselves to overcome the barriers we face, and we promote everyone’s participation by providing other sources of fulfillment and personal development.</p>
                        </section>
                        <section
                            className="values-principles"
                            id="values-principles"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                        >
                            <h3>Values and Principles</h3>
                            <p>Our values constitute the basis on which we establish the core of our activity and behavior.</p>
                        </section>
                        <section
                            className="promote-solidarity"
                            id="promote-solidarity"
                            data-aos="fade-up"
                            data-aos-duration="3000"
                        >
                            <h3>Promote Solidarity</h3>
                            <p>We believe that the right equation for a better society is to create conditions that bring together employees, companies and brands with the same objective: helping those in need.</p>
                        </section>

                        <section
                            className="environmental-responsibility"
                            id="environmental-responsibility"
                            data-aos="fade-up"
                            data-aos-duration="3000"
                        >
                            <h3>Environmental responsibility</h3>
                            <p>Reduce the ecological footprint through corporate and individual actions that take adjusted growth into account, to protect the environment for future generations, ensuring sustainability.</p>
                        </section>

                        <section
                            className="vision"
                            id="vision"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                        >
                            <h3>Vision</h3>
                            <p>We want to be influential agents in the environment in which we operate, contributing to a better society and promoting solidarity through the means available to us. Do good to those in need.</p>
                        </section>

                        <section
                            className="mission"
                            id="mission"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                        >
                            <h3>Mission</h3>
                            
                            <p>Our objective is, through individual and collective availability, to deliver the results of our efforts to entities whose needs can be minimized, through regular and lasting intervention. It is our understanding that this is the only possible way to help others and find a path to progress and personal growth.</p>
                            <p>Gaining the trust of clients, candidates and employees is Egor's most important goal. We want to not only listen, but above all strive to understand your needs and objectives .

We firmly believe that only by being able to listen to and understand each person's deepest concerns will we be able to create and propose the most appropriate organizational solutions, and help to achieve them, always with one objective: people and business.</p>
                        </section>
                        <section
                            className="how-to-help"
                            id="how-to-help"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                        >
                            <h3>How to help</h3>
                            <p>Become our partner, help us support causes, through monetary or in-kind donations, contributing with goods included in the respective campaigns, or otherwise contact us proposing a partnership!</p>
                            <p>Address for delivery of goods:</p>
                            <p>Av. José Malhoa, nº. 16 F – 4º</p>
                            <p>1070-159 LISBON</p>
                            <p>Contact: responsabilidadesocial@egor.pt</p>
                        </section>
                        
      </div>
    </section>

  );
};

export default AboutPage;