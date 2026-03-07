import React from 'react';
import { motion } from 'framer-motion';

const experiences = [
    {
        company: 'MIT CSAIL',
        role: 'Undergraduate Research Assistant',
        period: 'Sept 2024 - Present',
        impact: 'Researching Vision-Language Models (VLMs) and AI for real-world robotics systems.',
        tech: ['Python', 'PyTorch', 'Robotics']
    },
    {
        company: 'Frank and Eileen',
        role: 'AI/ML Engineer Intern',
        period: 'June 2024 - Aug 2024',
        impact: 'Developed predictive models for inventory management and supply chain optimization.',
        tech: ['Scikit-learn', 'Pandas', 'PostgreSQL']
    },
    {
        company: 'Codium',
        role: 'AI Fellow',
        period: 'Jan 2024 - May 2024',
        impact: 'Focused on AI-driven code generation and testing tools for developers.',
        tech: ['LLMs', 'Prompt Engineering', 'React']
    },
    {
        company: 'MIT Lunabotics',
        role: 'Robotics Team Member',
        period: 'Oct 2023 - Present',
        impact: 'Designing and building autonomous lunar excavators for NASA competitions.',
        tech: ['Computer Vision', 'ROS', 'C++']
    }
];

export default function Experience() {
    return (
        <section id="experience" className="py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Experience</h2>
                    <p className="text-muted-foreground max-w-xl">A trajectory of learning and building at the intersection of AI and impact.</p>
                </motion.div>

                <div className="relative border-l border-white/10 ml-4 md:ml-0 md:pl-0">
                    {experiences.map((exp, idx) => (
                        <motion.div
                            key={exp.company + exp.role}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative pl-12 pb-16 last:pb-0 group"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent-blue border-4 border-black group-hover:scale-125 transition-transform" />

                            <div className="glass-card p-8 group-hover:border-accent-blue/30 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{exp.role}</h3>
                                        <p className="text-accent-blue font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-muted-foreground bg-white/5 py-1 px-3 rounded-full border border-white/10">
                                        {exp.period}
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-6 leading-relaxed italic">{exp.impact}</p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.tech.map((t) => (
                                        <span key={t} className="text-xs font-semibold py-1 px-2 rounded bg-white/5 border border-white/10 text-white/70">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
