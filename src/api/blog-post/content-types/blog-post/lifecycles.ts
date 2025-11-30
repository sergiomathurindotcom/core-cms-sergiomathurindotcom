/**
 * Blog Post lifecycle hooks
 */

export default {
  async afterCreate(event) {
    const { result } = event;

    // Create snapshots for all related ideas
    if (result.relatedIdeas && Array.isArray(result.relatedIdeas)) {
      for (const ideaId of result.relatedIdeas) {
        await createIdeaSnapshot(ideaId, 'auto', `Blog post "${result.title}" created`);
      }
    }

    // Create snapshots for all related projects (which links back to ideas)
    if (result.relatedProjects && Array.isArray(result.relatedProjects)) {
      for (const projectId of result.relatedProjects) {
        const project: any = await strapi.entityService.findOne('api::project.project', projectId, {
          populate: { sourceIdea: true },
        });

        if (project?.sourceIdea) {
          await createIdeaSnapshot(
            project.sourceIdea.id,
            'auto',
            `Blog post "${result.title}" linked to project "${project.title}"`
          );
        }
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Create snapshots for newly added ideas
    if (result.relatedIdeas && Array.isArray(result.relatedIdeas)) {
      for (const ideaId of result.relatedIdeas) {
        await createIdeaSnapshot(ideaId, 'auto', `Blog post "${result.title}" updated`);
      }
    }

    // Create snapshots for newly added projects
    if (result.relatedProjects && Array.isArray(result.relatedProjects)) {
      for (const projectId of result.relatedProjects) {
        const project: any = await strapi.entityService.findOne('api::project.project', projectId, {
          populate: { sourceIdea: true },
        });

        if (project?.sourceIdea) {
          await createIdeaSnapshot(
            project.sourceIdea.id,
            'auto',
            `Blog post "${result.title}" linked to project "${project.title}"`
          );
        }
      }
    }
  },
};

async function createIdeaSnapshot(ideaId: number, triggerType: 'auto' | 'manual', triggerSource: string) {
  try {
    // Fetch the full idea data
    const idea = await strapi.entityService.findOne('api::idea.idea', ideaId, {
      populate: '*',
    });

    if (!idea) return;

    // Create the snapshot
    await strapi.entityService.create('api::idea-snapshot.idea-snapshot', {
      data: {
        idea: ideaId,
        snapshotDate: new Date(),
        title: idea.title as string,
        description: idea.description as string,
        status: idea.status as string,
        priority: idea.priority as string,
        tags: idea.tags,
        triggerType,
        triggerSource,
        snapshotData: JSON.stringify(idea),
        publishedAt: new Date(),
      },
    });
  } catch (error) {
    strapi.log.error('Failed to create idea snapshot:', error);
  }
}
