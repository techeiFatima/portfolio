import React from 'react';
import { motion } from 'framer-motion';

const skills = [
    {
        category: 'Programming',
        items: ['Python', 'JavaScript', 'SQL', 'C++', 'Dari'],
    },
    {
        category: 'ML / Data',
        items: ['PyTorch', 'CNNs', 'Scikit-learn', 'Pandas', 'OpenAI API'],
    },
    {
        category: 'Frameworks / Dev',
        items: ['React', 'Git', 'Linux', 'Vite', 'Tailwind CSS'],
    }
];

export default function Skills() {
    return (
        <section id="skills" className="py-24 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Technical Skillset</h2>
                <p className="text-muted-foreground mx-auto max-w-xl">The tools and technologies I use to bring ideas to life.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {skills.map((cat, idx) => (
                    <motion.div
                        key={cat.category}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 border border-white/10 rounded-3xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                    >
                        <h3 className="text-lg font-display font-bold text-accent-blue mb-8 uppercase tracking-widest">{cat.category}</h3>
                        <div className="flex flex-col gap-4">
                            {cat.items.map((item, i) => (
                                <div key={item} className="flex items-center justify-between group">
                                    <span className="text-foreground/80 group-hover:text-foreground transition-colors">{item}</span>
                                    <div className="h-[1px] flex-1 mx-4 bg-white/10 group-hover:bg-accent-blue/30 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
