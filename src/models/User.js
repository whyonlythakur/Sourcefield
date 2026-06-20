const { getSupabase } = require('../utils/supabase');

class UserModel {
  static async findOne(query) {
    const supabase = getSupabase();
    
    if (query.userId && query.guildId) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', query.userId)
        .eq('guild_id', query.guildId)
        .single();
      
      if (error || !data) return null;
      return this.formatFromSupabase(data);
    }
    
    return null;
  }

  static async findOneAndUpdate(query, update, options = {}) {
    const supabase = getSupabase();
    
    if (query.userId && query.guildId) {
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', query.userId)
        .eq('guild_id', query.guildId)
        .single();
      
      if (existing) {
        const updateData = {
          ...(update.warnPoints !== undefined && { warn_points: update.warnPoints }),
          ...(update.$inc?.warnPoints && { warn_points: existing.warn_points + update.$inc.warnPoints }),
          ...(update.history && { history: update.history }),
          ...(update.flags && { flags: update.flags }),
        };

        const { data: updated, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('user_id', query.userId)
          .eq('guild_id', query.guildId)
          .select()
          .single();
        
        if (error) throw error;
        return this.formatFromSupabase(updated);
      } else if (options.upsert) {
        const newData = {
          user_id: query.userId,
          guild_id: query.guildId,
          warn_points: 0,
          history: [],
          flags: { is_alt_suspect: false, account_age_at_join: null },
          ...update,
        };
        return await this.create(newData);
      }
    }
    
    return null;
  }

  static async create(data) {
    const supabase = getSupabase();
    const userData = {
      user_id: data.userId,
      guild_id: data.guildId,
      warn_points: data.warnPoints || 0,
      history: data.history || [],
      flags: data.flags || { is_alt_suspect: false, account_age_at_join: null },
    };

    const { data: inserted, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return this.formatFromSupabase(inserted);
  }

  static formatFromSupabase(data) {
    return {
      _id: data.id,
      userId: data.user_id,
      guildId: data.guild_id,
      warnPoints: data.warn_points,
      history: data.history || [],
      flags: data.flags || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

module.exports = UserModel;