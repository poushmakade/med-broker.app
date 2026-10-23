import React, { useEffect } from 'react';
import { Target, Eye, ShieldCheck, Heart, Zap, Award, Users, MapPin, CheckCircle2, ChevronLeft, Brain, Cpu, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './About.module.css';

const About = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const teamMembers = [
        { name: 'Poush Makade', roll: 'Roll No: 59', role: 'Full Stack & Platform Lead' },
        { name: 'Kartikeya Kalbandhe', roll: 'Roll No: 55', role: 'AI / ML Integration' },
        { name: 'Mohit Mohatkar', roll: 'Roll No: 57', role: 'Forecasting & Analytics' },
        { name: 'Rudra Bambal', roll: 'Roll No: 60', role: 'Marketplace Engine' },
        { name: 'Viplav Bhure', roll: 'Roll No: 63', role: 'Compliance & Security' }
    ];

    return (
        <div className={styles.aboutPage}>
            <div className={styles.container} style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        padding: 0
                    }}
                >
                    <ChevronLeft size={20} /> Back to Home
                </button>
            </div>

            {/* Mission & Vision Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.missionVision}>
                        <div className={styles.contentText}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
                                <span>Session 2026-27 | Semester VI</span>
                            </div>
                            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.2 }}>
                                PharmaSense: AI-Powered Pharmaceutical Intelligence Platform
                            </h1>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                                Department of Computer Science & Engineering (AIML)
                                <br />
                                <strong>Shri Ramdeobaba College of Engineering & Management, Nagpur</strong>
                            </p>
                            <div className={styles.cardTitle}>Platform Aim & Vision</div>
                            <p className={styles.cardText} style={{ fontSize: '1rem', marginBottom: '24px' }}>
                                Provide a robust platform that lets Indian vendors list their inventory visible to wholesale buyers globally, assisted by predictive AI sequence modeling for demand forecasting and stockout prevention.
                            </p>
                        </div>
                        <div className={styles.contentImage}>
                             <div style={{ 
                                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)', 
                                height: '380px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                padding: '40px',
                                gap: '16px',
                                borderRadius: '16px',
                                color: 'white',
                                textAlign: 'center'
                             }}>
                                <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '16px', borderRadius: '50%' }}>
                                    <Brain size={56} color="white" />
                                </div>
                                <h2 style={{ fontSize: '2.4rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>PharmaSense</h2>
                                <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: '280px', margin: 0 }}>
                                    AI-Driven Pharmaceutical Intelligence & Predictive Inventory Architecture
                                </p>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Supervision & Team Section */}
            <section className={styles.section} style={{ backgroundColor: '#f8fafc', padding: '48px 0' }}>
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className={styles.cardTitle} style={{ fontSize: '2rem', marginBottom: '8px' }}>Project Team & Supervision</h2>
                        <p className={styles.cardText}>
                            Guided By: <strong>Prof. Harshita Patil</strong> &nbsp;|&nbsp; Department of CSE (AIML)
                        </p>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                        gap: '20px',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        {teamMembers.map((member, idx) => (
                            <div key={idx} style={{ 
                                background: 'white', 
                                border: '1px solid var(--border)', 
                                borderRadius: '12px', 
                                padding: '20px', 
                                textAlign: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                            }}>
                                <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>{member.name}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, margin: '0 0 6px' }}>{member.roll}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Existing Systems vs PharmaSense Table */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className={styles.cardTitle} style={{ fontSize: '2.2rem' }}>Traditional Systems vs. PharmaSense</h2>
                        <p className={styles.cardText}>How PharmaSense addresses fundamental industry bottlenecks</p>
                    </div>

                    <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.04)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                            <thead>
                                <tr style={{ background: '#0f172a', color: 'white' }}>
                                    <th style={{ padding: '16px' }}>Dimension</th>
                                    <th style={{ padding: '16px' }}>Traditional Distributor Model</th>
                                    <th style={{ padding: '16px' }}>Current B2B E-Pharmacies</th>
                                    <th style={{ padding: '16px', background: 'var(--primary)' }}>PharmaSense AI</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px', fontWeight: 600 }}>Inventory</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Owns heavy inventory</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Inventory-led warehouse model</td>
                                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary)' }}>No inventory ownership (Asset-light)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px', fontWeight: 600 }}>Vendor Choice</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Limited regional suppliers</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Restricted vendor network</td>
                                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary)' }}>Multi-vendor transparent marketplace</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px', fontWeight: 600 }}>Pricing</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Non-transparent, relationship-based</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Partial retail visibility</td>
                                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary)' }}>Real-time transparent price comparisons</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px', fontWeight: 600 }}>Demand Planning</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Manual spreadsheets & gut-feeling</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Reactive reordering</td>
                                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary)' }}>Deep Learning Sequence LSTM Forecasting</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '16px', fontWeight: 600 }}>Compliance</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Manual offline paper checks</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Semi-digital onboarding</td>
                                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary)' }}>Integrated GSTIN & Drug License Trust Gate</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className={styles.section} style={{ backgroundColor: '#f8fafc' }}>
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className={styles.cardTitle} style={{ fontSize: '2.2rem' }}>PharmaSense Core Capabilities</h2>
                        <p className={styles.cardText}>Core services driving our 30-40% milestone release</p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>
                                <Brain size={32} />
                            </div>
                            <h3 className={styles.cardTitle}>Demand Forecasting</h3>
                            <p className={styles.cardText}>
                                AI evaluates historical orders, 3-month seasonality velocity, and price elasticity to prevent stockouts and overstock for vendors.
                            </p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardIcon}>
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className={styles.cardTitle}>Compliance & Trust</h3>
                            <p className={styles.cardText}>
                                Rigorous verification of vendor drug licenses and GST numbers before any pharmaceutical catalogue goes live.
                            </p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardIcon}>
                                <TrendingUp size={32} />
                            </div>
                            <h3 className={styles.cardTitle}>Dynamic Pricing</h3>
                            <p className={styles.cardText}>
                                Real-time tiered bulk discount calculations and transparent multi-vendor comparisons for institutional buyers.
                            </p>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>
                                <Zap size={32} />
                            </div>
                            <h3 className={styles.cardTitle}>Innovation Driven</h3>
                            <p className={styles.cardText}>
                                From AI-powered recommendations to secure real-time tracking, we use technology to solve the most complex healthcare logistics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className={styles.section} style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                         <h2 className={styles.cardTitle} style={{ fontSize: '2.5rem' }}>Why Healthcare Partners Choose PharmaSense</h2>
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {[
                            '100% Authentic Products Sourcing',
                            'Automated GST-Compliant Invoicing',
                            'Real-time Inventory Management for Vendors',
                            'Next-day Delivery in Major Metro Cities',
                            'Dedicated 24/7 Professional Support',
                            'Secure Encrypted Payment Gateway'
                        ].map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px',
                                borderBottom: '1px solid var(--color-border)'
                            }}>
                                <CheckCircle2 size={24} color="var(--color-primary)" />
                                <span style={{ fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 500 }}>{item}</span>
                            </div>
                        ))}
>>>>>>> feat/lavender-ui-redesign
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
