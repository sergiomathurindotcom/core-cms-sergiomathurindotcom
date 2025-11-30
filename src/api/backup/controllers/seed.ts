export default {
  async seedDatabase(ctx) {
    try {
      strapi.log.info('Starting database seeding...');
      const results = {
        siteSettings: null,
        pageContents: [],
        boxOfChocolatesOutcomes: [],
        emptyStates: null,
        about: null,
      };

      // 1. Seed Site Settings (Single Type)
      strapi.log.info('Seeding Site Settings...');
      const siteSettings = await strapi.entityService.findMany('api::site-settings.site-settings' as any);

      if (!siteSettings || Object.keys(siteSettings).length === 0) {
        results.siteSettings = await strapi.entityService.create('api::site-settings.site-settings' as any, {
          data: {
            siteMantra: 'Learn. Apply. Create.',
            heroTitle: 'Sergio Mathurin',
            heroSubtitle: 'Computer Scientist, Data Scientist, Mad Scientist',
            heroDescription: 'I work on things I find interesting. Hard problems, weird ideas, cool solutions.',
          },
        });
        strapi.log.info('Site Settings created');
      } else {
        strapi.log.info('Site Settings already exist, skipping');
      }

      // 2. Seed Page Contents
      strapi.log.info('Seeding Page Contents...');
      const pageContentsData = [
        {
          pageKey: 'blog',
          title: 'Blog',
          subtitle: 'Thoughts on hard problems, weird ideas, and things that probably shouldn\'t work but do.',
          description: null,
          infoNote: null,
        },
        {
          pageKey: 'projects',
          title: 'Projects',
          subtitle: 'Things I\'ve built while asking "what if?" and "why not?"',
          description: null,
          infoNote: null,
        },
        {
          pageKey: 'ideas',
          title: 'Ideas',
          subtitle: 'The backlog of possibilities. Projects I want to build, problems I want to solve, rabbit holes I want to explore.',
          description: null,
          infoNote: '<p><strong>Note:</strong> These are ideas in various stages of thought. Some are well-defined, others are just sparks. The list changes as curiosity strikes and priorities shift.</p>',
        },
        {
          pageKey: 'box-of-chocolates',
          title: 'Box of Chocolates',
          subtitle: 'Life is like a box of chocolates...',
          description: null,
          infoNote: null,
        },
      ];

      for (const pageData of pageContentsData) {
        const existing = await strapi.entityService.findMany('api::page-content.page-content' as any, {
          filters: { pageKey: pageData.pageKey },
        }) as any;

        if (!existing || (Array.isArray(existing) && existing.length === 0)) {
          const created = await strapi.entityService.create('api::page-content.page-content' as any, {
            data: pageData,
          });
          results.pageContents.push(created);
          strapi.log.info(`Page content created for: ${pageData.pageKey}`);
        } else {
          strapi.log.info(`Page content already exists for: ${pageData.pageKey}, skipping`);
        }
      }

      // 3. Seed Box of Chocolates Outcomes
      strapi.log.info('Seeding Box of Chocolates Outcomes...');
      const outcomesData = [
        {
          title: "The Philosopher's Stone",
          message: "You've discovered the secret to turning coffee into code. Your productivity increases by 3000%.",
          emoji: "☕️➡️💻",
          displayOrder: 1,
        },
        {
          title: "Schrödinger's Bug",
          message: "The bug both exists and doesn't exist until you check the logs. Quantum debugging unlocked.",
          emoji: "🐛📦",
          displayOrder: 2,
        },
        {
          title: "The Infinite Loop of Wisdom",
          message: "You've achieved enlightenment by understanding that understanding is understanding that you'll never fully understand.",
          emoji: "∞🧘",
          displayOrder: 3,
        },
        {
          title: "The Documentation Paradox",
          message: "You found documentation that's actually up-to-date. Reality is now unstable.",
          emoji: "📚✨",
          displayOrder: 4,
        },
        {
          title: "The Perfect Commit",
          message: "Your commit message is so clear that future you actually understands it. The timeline has been altered.",
          emoji: "📝⏰",
          displayOrder: 5,
        },
        {
          title: "The Rubber Duck's Revenge",
          message: "The rubber duck has gained sentience and is now debugging YOUR life choices.",
          emoji: "🦆💭",
          displayOrder: 6,
        },
        {
          title: "Stack Overflow Singularity",
          message: "You've read every Stack Overflow answer ever written. You are now the chosen one.",
          emoji: "📚🌟",
          displayOrder: 7,
        },
        {
          title: "The Midnight Debugger",
          message: "It's 3 AM. You've been debugging for 6 hours. The bug was a typo. You are one with the darkness now.",
          emoji: "🌙🔍",
          displayOrder: 8,
        },
        {
          title: "The Legacy Code Archaeologist",
          message: "You've discovered a function from 2003. It still works. Nobody knows why. You dare not touch it.",
          emoji: "🏺👴",
          displayOrder: 9,
        },
        {
          title: "The Async Void",
          message: "You stared into the async void. The async void stared back. Now you both await nothing.",
          emoji: "⏳👁️",
          displayOrder: 10,
        },
        {
          title: "The Recursion Inception",
          message: "You're debugging a recursive function within a dream within a recursive function. Wake up.",
          emoji: "🌀💤",
          displayOrder: 11,
        },
        {
          title: "The Tab vs Spaces Enlightenment",
          message: "You've transcended the tab vs spaces debate. You now use both simultaneously. Chaos reigns.",
          emoji: "⌨️🔥",
          displayOrder: 12,
        },
        {
          title: "The Git Rebase Master",
          message: "You successfully rebased without conflicts. The git gods smile upon you.",
          emoji: "🌳✨",
          displayOrder: 13,
        },
        {
          title: "The Heap Memory Liberation",
          message: "You've freed all the memory. Unfortunately, you also freed the memory of freeing memory. Good luck.",
          emoji: "💾🕊️",
          displayOrder: 14,
        },
        {
          title: "The Pair Programming Singularity",
          message: "You and your pair have become so synchronized, you're now one entity. HR is concerned.",
          emoji: "👥🔗",
          displayOrder: 15,
        },
        {
          title: "The Whiteboard Interview Mastery",
          message: "You've solved the whiteboard problem so elegantly that the interviewer quit their job to work for you.",
          emoji: "📋🎯",
          displayOrder: 16,
        },
        {
          title: "The Coffee++ Achievement",
          message: "You've consumed enough coffee to achieve compile-time optimization of your brain. Side effects may include jitters.",
          emoji: "☕️++",
          displayOrder: 17,
        },
        {
          title: "The Senior Developer Aura",
          message: "Junior developers now instinctively bring you coffee and ask for code reviews. Your transformation is complete.",
          emoji: "👴💼",
          displayOrder: 18,
        },
        {
          title: "The Deployment Friday",
          message: "You deployed to production on a Friday. And it worked. The prophecy is true.",
          emoji: "🚀😱",
          displayOrder: 19,
        },
        {
          title: "The Hacker News Karma King",
          message: "Your comment 'This' has received 10,000 upvotes. You are now a thought leader.",
          emoji: "📰👑",
          displayOrder: 20,
        },
      ];

      const existingOutcomes = await strapi.entityService.findMany('api::box-of-chocolates-outcome.box-of-chocolates-outcome' as any) as any;

      if (!existingOutcomes || (Array.isArray(existingOutcomes) && existingOutcomes.length === 0)) {
        for (const outcomeData of outcomesData) {
          const created = await strapi.entityService.create('api::box-of-chocolates-outcome.box-of-chocolates-outcome' as any, {
            data: outcomeData,
          });
          results.boxOfChocolatesOutcomes.push(created);
        }
        strapi.log.info(`Created ${outcomesData.length} Box of Chocolates outcomes`);
      } else {
        strapi.log.info('Box of Chocolates outcomes already exist, skipping');
      }

      // 4. Seed Empty States (Single Type)
      strapi.log.info('Seeding Empty States...');
      const emptyStates = await strapi.entityService.findMany('api::empty-states.empty-states' as any);

      if (!emptyStates || Object.keys(emptyStates).length === 0) {
        results.emptyStates = await strapi.entityService.create('api::empty-states.empty-states' as any, {
          data: {
            blogPostsEmpty: 'No blog posts yet. The first one is brewing...',
            projectsEmpty: 'No projects yet. Check back soon!',
            ideasEmptyAll: 'The idea backlog is empty. Time to start dreaming!',
            ideasEmptyFiltered: 'No ideas with this status. Try another filter!',
          },
        });
        strapi.log.info('Empty States created');
      } else {
        strapi.log.info('Empty States already exist, skipping');
      }

      // 5. Seed About content
      strapi.log.info('Seeding About content...');
      const existingAbout = await strapi.entityService.findMany('api::about.about' as any) as any;

      if (!existingAbout || (Array.isArray(existingAbout) && existingAbout.length === 0)) {
        results.about = await strapi.entityService.create('api::about.about' as any, {
          data: {
            title: 'About',
            subtitle: 'Computer Scientist. Data Scientist. Problem Solver.',
            whoIAm: `<p>I'm Sergio Mathurin, a technologist who thrives on turning complex problems into elegant solutions. My work spans computer science and data science, always driven by curiosity and the question: "what if?"</p>`,
            whatIDo: `<p>I build things that matter. From data pipelines that process millions of records to machine learning models that uncover hidden patterns, I focus on creating systems that are both powerful and practical.</p><p>My approach combines rigorous technical execution with creative problem-solving. Whether it's optimizing algorithms, architecting scalable systems, or exploring new technologies, I'm driven by the challenge of making the impossible possible.</p>`,
            howIWork: `<p>I believe in learning by doing. Every project is an opportunity to push boundaries and explore new ideas. I'm not afraid of hard problems or unconventional approaches. If something seems interesting and worth building, I'll figure out how to make it happen.</p>`,
            beyondTheCode: `<p>When I'm not coding, you'll find me diving deep into research papers, experimenting with new technologies, or working on side projects that explore the intersection of science, technology, and creativity.</p>`,
          },
        });
        strapi.log.info('About content created');
      } else {
        strapi.log.info('About content already exists, skipping');
      }

      strapi.log.info('Database seeding completed successfully');

      return ctx.send({
        success: true,
        message: 'Database seeded successfully',
        results: {
          siteSettings: results.siteSettings ? 'created' : 'skipped (already exists)',
          pageContents: `${results.pageContents.length} created`,
          boxOfChocolatesOutcomes: `${results.boxOfChocolatesOutcomes.length} created`,
          emptyStates: results.emptyStates ? 'created' : 'skipped (already exists)',
          about: results.about ? 'created' : 'skipped (already exists)',
        },
      });
    } catch (error) {
      strapi.log.error('Database seeding failed:', error);
      ctx.throw(500, `Database seeding failed: ${error.message}`);
    }
  },

  async clearSeedData(ctx) {
    try {
      strapi.log.info('Clearing seed data...');
      const results = {
        deleted: {
          pageContents: 0,
          boxOfChocolatesOutcomes: 0,
        },
      };

      // Delete all page contents
      const pageContents = await strapi.entityService.findMany('api::page-content.page-content' as any) as any;
      if (pageContents && Array.isArray(pageContents) && pageContents.length > 0) {
        for (const page of pageContents) {
          await strapi.entityService.delete('api::page-content.page-content' as any, page.id);
          results.deleted.pageContents++;
        }
      }

      // Delete all box of chocolates outcomes
      const outcomes = await strapi.entityService.findMany('api::box-of-chocolates-outcome.box-of-chocolates-outcome' as any) as any;
      if (outcomes && Array.isArray(outcomes) && outcomes.length > 0) {
        for (const outcome of outcomes) {
          await strapi.entityService.delete('api::box-of-chocolates-outcome.box-of-chocolates-outcome' as any, outcome.id);
          results.deleted.boxOfChocolatesOutcomes++;
        }
      }

      strapi.log.info('Seed data cleared successfully');

      return ctx.send({
        success: true,
        message: 'Seed data cleared successfully',
        results: results.deleted,
      });
    } catch (error) {
      strapi.log.error('Failed to clear seed data:', error);
      ctx.throw(500, `Failed to clear seed data: ${error.message}`);
    }
  },
};
