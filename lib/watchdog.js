export async function checkNodeStatus() {
  const nodes = await Node.find({});
  const TIMEOUT_LIMIT = 5 * 60 * 1000; // 5 minutes

  for (const node of nodes) {
    const lastSeen = new Date(node.lastSeen).getTime();
    const now = new Date().getTime();

    if (now - lastSeen > TIMEOUT_LIMIT && node.status !== "OFFLINE") {
      // Send Alert
      await sendEmail(
        "authority@dcc.gov",
        `⚠️ NODE DISCONNECTED: ${node.node_id}`,
        `Node: ${node.node_id} at Location: ${node.location} is OFFLINE. Last seen at: ${node.lastSeen}`
      );
      // Update DB to prevent duplicate emails
      await Node.updateOne({ node_id: node.node_id }, { status: "OFFLINE" });
    }
  }
}