import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Search, Code } from 'lucide-react';

const categories = [
    {
        title: 'AI',
        icon: Brain,
        description: 'Deep Learning, LLMs, and Neural Networks.',
        color: 'text-accent-blue',
        bg: 'bg-accent-blue/10'
    },
    {
        title: 'Robotics',
        icon: Cpu,
        description: 'Autonomous systems and decision-making.',
        color: 'text-accent-purple',
        bg: 'bg-accent-purple/10'
    },
    {
        title: 'Research',
        icon: Search,
        description: 'Investigating VLM and real-world AI impact.',
        color: 'text-accent-cyan',
        bg: 'bg-accent-cyan/10'
    },
    {
        title: 'Full-stack',
        icon: Code,
        description: 'Building scalable AI-powered applications.',
        color: 'text-white',
        bg: 'bg-white/10'
    }
];

export default function About() {
    return (
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                        Pioneering the <span className="text-gradient">Future of AI</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        As a student at MIT studying Artificial Intelligence and Decision-Making, I am passionate about building technology that matters. My work sits at the intersection of machine learning, robotics, and design thinking.
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        I believe that the most powerful systems are those that blend rigorous engineering with a deep understanding of human needs. I'm currently focused on how AI can enhance decision-making in real-world environments.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="glass-card p-6 flex flex-col gap-4 hover:border-white/20 transition-all"
                        >
                            <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center ${cat.color}`}>
                                <cat.icon size={24} />
                            </div>
                            <h3 className="font-bold text-lg">{cat.title}</h3>
                            <p className="text-sm text-muted-foreground">{cat.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-32 text-center"
            >
                <h3 className="text-xl font-display font-bold uppercase tracking-widest text-white/40 mb-12">
                    Technical Interests
                </h3>
                <div className="flex flex-wrap justify-center gap-12 opacity-60">
                    {["Vision-Language Models", "Robotics Control", "Reinforcement Learning", "AI Ethics", "Decision Systems"].map((item) => (
                        <span key={item} className="text-lg md:text-2xl font-display font-medium">{item}</span>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
