import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';
import AboutUs from './Aboutus';
import ContactUs from './ContactUs';
import Services from './Services';
import GridBackground from './GridBackground';
import image1 from './image1.png';
import image2 from './image2.png';
import image3 from './image3.png';

import talentImage from './talent-image.jpg';
import synchroImage from './synchro-image.jpg';
import bridgeImage from './bridge-image.jpg';
import consultingImage from './consulting-image.jpg';
import developmentImage from './development-image.jpg';
import hrtechImage from './hrtech-image.jpg';
import logonew from './logonew.png'; // Import the new logo image
import logowhite from './logowhite.png';

const Home = () => {
    const [activeComponent, setActiveComponent] = useState('home');
    const [selectedSection, setSelectedSection] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('talent');
    const itemRefs = useRef({});
    const sectionRef = useRef(null);  // Add this line

    const handleMenuClick = (component) => {
        setActiveComponent(component);
        setMenuOpen(false); // Close the menu after clicking
    };

    const handleItemClick = (id) => {
        setActiveItem(prevActiveItem => prevActiveItem === id ? null : id);
        setTimeout(() => {
            if (itemRefs.current[id] && sectionRef.current) {
                const yOffset = -100; // Adjust this value to fine-tune the scroll position
                const element = itemRefs.current[id];
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 500); // Small delay to ensure content is rendered before scrolling
    };


    useEffect(() => {
        AOS.init();

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const renderWhatWeDo = () => {
        const whatWeDoItems = [
            { 
                id: 'talent', 
                title: 'Talent Acquisition Solutions', 
                content: 'Talent Acquisition Solutions provides clients with expert support to thrive in a volatile market where talent is increasingly scarce and recruitment increasingly complex.', 
                image: talentImage,
                link: 'https://egor.pt/en/talent-acquisition/'
            },
            { 
                id: 'synchro', 
                title: 'Synchro, by Egor', 
                content: 'Synchro is an Egor partner company. Specializing in outsourcing projects/services for large and medium-sized companies, it seeks to reduce its partners operating costs and increase their operational efficiency.', 
                image: synchroImage,
                link: 'https://synchro.pt/en/pagina-inical/'
            },
            { 
                id: 'bridge', 
                title: 'The Bridge, by Egor', 
                content: 'The Bridge is an Egor associated company specializing in the recruitment, selection and hiring of temporary workers for public and private companies.', 
                image: bridgeImage,
                link: 'https://the-bridge.pt/en/pagina-inicial/'
            },
            { 
                id: 'consulting', 
                title: 'Consulting', 
                content: 'It promotes solutions focused on People, aiming at the success of Companies, through constant updating and a multidisciplinary approach, specialized in management and transformation consultancy.', 
                image: consultingImage,
                link: 'https://egor.pt/en/consulting/'
            },
            { 
                id: 'development', 
                title: 'Human Development', 
                content: 'It seeks to develop talent through the transformation of human and business potential, stimulating partnership relationships. It uses tailor-made approaches and methodologies to create sustainable projects, taking into account the needs of its partners, combined with solid implementation and innovation.', 
                image: developmentImage,
                link: 'https://egor.pt/en/human-development/'
            },
            { 
                id: 'hrtech', 
                title: 'HR Tech Solutions', 
                content: 'Through the Innovation & Technology area, the market is analyzed to identify potential solutions that provide responses to the challenges of new technologies in the area of ​​Human Resources.', 
                image: hrtechImage,
                link: 'https://egor.pt/en/hr-tech-solutions/'
            }
        ];
        
        return (
            <section className="what-we-do" id="what-we-do" ref={sectionRef}>
            <h2>What We Do</h2>
            <div className="main-content">
                <ul style={{ fontSize: '25px' }}>
                    {whatWeDoItems.map(item => (
                        <React.Fragment key={item.id}>
                            <li
                                className={`list-item ${activeItem === item.id ? 'active' : ''}`}
                                onClick={() => handleItemClick(item.id)}
                            >
                                {item.title}
                            </li>
                            {activeItem === item.id && (
                                <div 
                                    className="item-content"
                                    ref={el => itemRefs.current[item.id] = el}
                                >
                                    <div className="content-wrapper">
                                        <p data-aos="fade-up"
                                           data-aos-duration="1500" 
                                           style={{color: 'black', fontSize: '22px'}}>
                                            {item.content}
                                        </p>
                                        <div className="button-container">
                                            <a href={item.link} className="view-more-btn" target="_blank" rel="noopener noreferrer">
                                                View More
                                            </a>
                                        </div>
                                    </div>
                                    <img src={item.image} alt={item.title} className="item-image" data-aos="fade-up"
                                         data-aos-duration="2500"  />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </div>
        </section>
        );
    };
    
    const renderComponent = () => {
        switch (activeComponent) {
            case 'about':
                return <AboutUs />;
            case 'contact':
                return <ContactUs />;
            case 'services':
                return <Services />;
            
            default:
                return (
                    <>            

                        <motion.section
                            className="ecosystem"
                            id="ecosystem"
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 2 }}
                        >
                            <h1> EGOR Ecosystem</h1>
                            <p style={{fontSize : '22px'}}>In nature, an ecosystem is a community of living organisms that interact with each other in a given environmental system, where different realities coexist. In the business world, organizations operate in a similar way, in a network of products and services that interact and compete with each other. The EGOR Ecosystem aims to contribute to the harmonization of the labor world through a holistic vision that promotes the matching between the organizations’ efficiency goals and the motivations and legitimate aspirations of people and redesigns new ways of looking at the labor market.</p>
                        </motion.section>
                        <div className="image-row" style={{ backgroundColor: 'black' }}>
            <motion.section
                className="side-image"
                id="side-image1"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 2 }}
            >
                <img src={image2} alt="Description of image2" className="side-image" />
                <h5 style={{ color: 'green' ,fontSize: 30,paddingLeft : 20}}>Driving Growth and Innovation - Our approach is centered around fostering a culture of continuous improvement and innovation, empowering individuals and organizations to reach new heights.</h5>

            </motion.section>
            <motion.section
                className="side-image"
                id="side-image2"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 2 }}
            >
                <img src={image3} alt="Description of image3" className="side-image"  />
                <h5 style={{ color: 'green' ,fontSize: 30,paddingLeft : 20}}>Empowering Global Insights - At our firm, we bring world-class expertise to the forefront, helping organizations navigate complex global markets with precision and insight.</h5>
            </motion.section>
            <motion.section
                className="side-image"
                id="side-image3"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 2 }}
            >
                <img src={image1} alt="Description of image1" className="side-image"  />
                <h5 style={{ color: 'green' ,fontSize: 30,paddingLeft : 20}}>Enhancing Connectivity - We focus on strengthening the links between strategy, technology, and human resource management to boost organizational efficiency and communication.</h5>

            </motion.section>
            
        </div>
       
        <section
                            className="egor-group"
                            id="egor-group"
                            data-aos="fade-up"
                            data-aos-duration="3500"
                        >
                            <h2>The Egor Group</h2>
                            <p>The Egor Group comprises a group of specialized companies which, since 1986, have been designing, proposing and implementing tailor-made people management solutions in all areas of organizations.</p>
                            {renderWhatWeDo()}
                        </section>



                        <section
                            className="social-responsibility"
                            id="social-responsibility"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                        >
                            <h2> Social responsibility</h2>
                            <h3>A Conversa Acontece | Podcast</h3>
                            <p>“A Conversa Acontece” (A Talk Happens) is an initiative of “Egor Faz Acontecer” (Egor Makes it Happen) that aims to break down and clarify current issues in our society, in a conversation with guests.</p>
                           
                            <button onClick={() => setShowVideo(true)} className="video-button">Watch Podcast</button>
                            {showVideo && (
                                <div className="video-container">
                                   <iframe width="560" height="315" src="https://www.youtube.com/embed/9Fj1YZO9ldk?si=IjnJqR9hMDbPoKV6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                </div>
                            )}
                            <p>Welcome to our podcast!</p>
                            <p>Egor consists of a group of companies, with 100% national share capital, in the area of human resources consultancy. Through its knowledge and structure acquired over more than 30 years, the social responsibility project, ‘Egor Makes it Happen’, was born. It seeks to help those who need it the most, aiming to create equitable conditions.</p>
                        </section>

        

                      

                        

                        

                        
                        

                        
                        
                        

                        

                        
                        

                        

                        
                    </>
                );
        }
    };

    return (
        <div className="home-page">
            <GridBackground />
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                <nav className="nav">
                    <a href="" onClick={() => handleMenuClick('home')} className="logo">
                        <img src={isScrolled ? logonew : logowhite} alt="Logo" className="logo-image" />
                    </a>
                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </button>
                    <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
                        <li><a className='aboutt' onClick={() => handleMenuClick('about')}>About Us</a></li>
                        <li><a className='servicess' onClick={() => handleMenuClick('services')}>Services</a></li>
                        <li><a href="https://egor.pt/en/contacts/" className='contactt' >Contact Us</a></li>
                        <li><a href="https://egor.pt/blog/">Blogs</a></li>
                    </ul>
                </nav>
            </header>
            {renderComponent()}
            
            
            <footer className="footer">
                <div className="footer-links">
                    <a href="https://egor.pt/en/terms-and-conditions/">Terms and Conditions</a>
                    <a href="https://egor.pt/en/privacy-policy/">Privacy Policy</a>
                    <a href="#contact" onClick={()=>{setActiveComponent('contact')}}>Contact Us</a>
                    <a href='https://egor.pt/blog/'>Blogs</a>
                </div>
                 <a href="#home" onClick={() => handleMenuClick('home')} className="logo">
                        <img src={logonew} alt="Logo" className="logoo" />
                    </a> 
                
            </footer>
        </div>
    );
};

export default Home;