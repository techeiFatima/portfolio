import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, FileText, Send } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="glass-card p-12 relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-[-50%] left-[-10%] w-[40%] h-[100%] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-50%] right-[-10%] w-[40%] h-[100%] bg-accent-purple/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tight">
                            Let's build <br />
                            <span className="text-gradient">something together</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-12 max-w-md">
                            Currently looking for opportunities in AI research, robotics, and engineering. Whether you have a question or just want to say hi, my inbox is always open.
                        </p>

                        <div className="space-y-6">
                            <a href="mailto:fatima@example.com" className="flex items-center gap-4 text-lg hover:text-accent-blue transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent-blue/50 transition-colors">
                                    <Mail size={20} />
                                </div>
                                fatima@example.com
                            </a>
                            <div className="flex gap-4">
                                {[
                                    { icon: Linkedin, href: 'https://linkedin.com/in/fatima-danishyar-a2691322a/', label: 'LinkedIn' },
                                    { icon: Github, href: 'https://github.com', label: 'GitHub' },
                                    { icon: FileText, href: '/resume.pdf', label: 'Resume' }
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                                        title={social.label}
                                    >
                                        <social.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-6"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-2">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent-blue/50 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent-blue/50 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-2">Message</label>
                            <textarea
                                rows={5}
                                placeholder="How can I help you?"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent-blue/50 transition-colors resize-none"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                        >
                            Send Message
                            <Send size={18} />
                        </motion.button>
                    </motion.form>
                </div>
            </div>

            <footer className="mt-24 pt-8 border-t border-white/5 text-center text-muted-foreground text-sm">
                <p>© {new Date().getFullYear()} Fatima Danishyar. Built with React & Framer Motion.</p>
            </footer>
        </section>
    );
}
