async function handleMemberAdd(member, client) {
  if (member.user.bot) return;

  const raidModule = client.modules?.antiRaid;
  const newAcctModule = client.modules?.newAccount;
  const altModule = client.modules?.altDetection;

  // TODO: implement raid/new-account/alt checks
}

module.exports = { handleMemberAdd };
