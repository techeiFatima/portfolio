import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        title: 'MIT Course Catalog RAG',
        description: 'An intelligent retrieval-augmented generation system for navigating the MIT course catalog using vector embeddings.',
        tags: ['Python', 'OpenAI', 'LangChain', 'ChromaDB'],
        github: 'https://github.com',
        demo: 'https://demo.com'
    },
    {
        title: 'Dorm Deals',
        description: 'A peer-to-peer marketplace for MIT students, winning top honors in university-wide startup competition.',
        tags: ['React', 'Firebase', 'Node.js', 'Tailwind'],
        github: 'https://github.com',
        demo: 'https://demo.com'
    }
];

export default function Projects() {
    return (
        <section id="projects" className="py-24 px-6 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Selected Work</h2>
                        <p className="text-muted-foreground max-w-xl">Turning complex problems into elegant software solutions.</p>
                    </motion.div>
                    <a href="https://github.com" className="nav-link flex items-center gap-2 mb-2">
                        View all on GitHub <ExternalLink size={16} />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass-card overflow-hidden group border-white/5"
                        >
                            <div className="h-48 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center border-b border-white/10 group-hover:scale-105 transition-transform duration-500">
                                <span className="text-4xl font-display font-bold text-white/20">PREVIEW</span>
                            </div>
                            <div className="p-8">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-accent-cyan bg-accent-cyan/10 py-1 px-2 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                                <p className="text-muted-foreground mb-8 line-clamp-2">{project.description}</p>
                                <div className="flex gap-4">
                                    <a href={project.demo} className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:opacity-90 transition-opacity">
                                        Demo
                                    </a>
                                    <a href={project.github} className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                                        <Github size={20} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
