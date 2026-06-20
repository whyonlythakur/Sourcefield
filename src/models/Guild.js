const { getSupabase } = require('../utils/supabase');

class GuildModel {
  static async findOne(query) {
    const supabase = getSupabase();
    
    if (query.guildId) {
      const { data, error } = await supabase
        .from('guilds')
        .select('*')
        .eq('guild_id', query.guildId)
        .single();
      
      if (error || !data) return null;
      return this.formatFromSupabase(data);
    }
    
    return null;
  }

  static async create(data) {
    const supabase = getSupabase();
    const formatted = this.formatToSupabase(data);
    
    const { data: inserted, error } = await supabase
      .from('guilds')
      .insert([formatted])
      .select()
      .single();
    
    if (error) throw error;
    return this.formatFromSupabase(inserted);
  }

  static async findOneAndUpdate(query, update, options = {}) {
    const supabase = getSupabase();
    
    if (query.guildId) {
      const { data: existing } = await supabase
        .from('guilds')
        .select('*')
        .eq('guild_id', query.guildId)
        .single();
      
      if (existing) {
        const formattedUpdate = this.formatToSupabase(update);
        const { data: updated, error } = await supabase
          .from('guilds')
          .update(formattedUpdate)
          .eq('guild_id', query.guildId)
          .select()
          .single();
        
        if (error) throw error;
        return this.formatFromSupabase(updated);
      } else if (options.upsert) {
        const newData = { guild_id: query.guildId, ...update };
        return await this.create(newData);
      }
    }
    
    return null;
  }

  static async deleteOne(query) {
    const supabase = getSupabase();
    
    if (query.guildId) {
      const { error } = await supabase
        .from('guilds')
        .delete()
        .eq('guild_id', query.guildId);
      
      return !error;
    }
    
    return false;
  }

  static formatFromSupabase(data) {
    return {
      _id: data.id,
      guildId: data.guild_id,
      prefix: data.prefix || '!',
      ownerOverrides: data.owner_overrides || [],
      staff: data.staff || [],
      modules: data.modules || {},
      logChannels: data.log_channels || {},
      verification: data.verification || {},
      security: data.security || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static formatToSupabase(data) {
    return {
      guild_id: data.guildId || data.guild_id,
      prefix: data.prefix,
      owner_overrides: data.ownerOverrides,
      staff: data.staff,
      modules: data.modules,
      log_channels: data.logChannels,
      verification: data.verification,
      security: data.security,
    };
  }
}

module.exports = GuildModel;