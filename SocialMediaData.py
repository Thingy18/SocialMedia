import networkx as nx
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np


class SocialMediaGraph:
    def __init__(self):
        self.graph = nx.Graph()
        self.layout = None

    def add_user(self, user_id):
        """Add a user node to the graph."""
        self.graph.add_node(user_id, is_user=True, comments=0, views=0)

    def add_post(self, post_id, comments, views):
        """Add a post node to the graph."""
        self.graph.add_node(post_id, is_user=False, comments=comments, views=views)

    def add_connection(self, source, destination, connection_type):
        """Add an edge between two nodes with a connection type."""
        self.graph.add_edge(source, destination, type=connection_type)

    def draw(self, criterion="comments"):
        """
        Visualize the graph, highlighting nodes based on the specified criterion.
        :param criterion: The criterion to highlight nodes ('comments' or 'views').
        """
        if criterion not in ["comments", "views"]:
            raise ValueError("Invalid criterion. Choose 'comments' or 'views'.")

        # Compute layout if not already computed
        if self.layout is None:
            self.layout = nx.spring_layout(self.graph, seed=42)

        # Assign colors to nodes based on the criterion
        node_colors = [self._calculate_node_color(node, criterion) for node in self.graph.nodes]

        # Draw graph
        self._plot_graph(node_colors, criterion)

    def _calculate_node_color(self, node, criterion):
        """Calculate the color for a node based on the given criterion."""
        attribute_values = list(nx.get_node_attributes(self.graph, criterion).values())
        min_value = min(attribute_values, default=0)
        max_value = max(attribute_values, default=1)
        value = self.graph.nodes[node].get(criterion, 0)

        # Normalize values to fit within the colormap
        norm = mcolors.Normalize(vmin=min_value, vmax=max_value)
        cmap = plt.get_cmap("Blues")  # Changed color map to 'Blues'
        return cmap(norm(value))

    def _plot_graph(self, node_colors, criterion):
        """Plot the graph with appropriate node colors and a legend."""
        fig, ax = plt.subplots(figsize=(12, 8))
        nx.draw(
            self.graph,
            pos=self.layout,
            with_labels=True,
            node_color=node_colors,
            node_size=300,
            font_size=8,
            font_color="black",
            edge_color="lightblue",  # Changed edge color to light blue
            linewidths=0.5,
            width=0.5,
            alpha=0.7,
            ax=ax,
        )

        # Add edge labels
        edge_labels = nx.get_edge_attributes(self.graph, "type")
        nx.draw_networkx_edge_labels(self.graph, pos=self.layout, edge_labels=edge_labels, ax=ax)

        # Add legend
        self._add_legend(criterion, ax, fig)
        plt.title(f"Social Media Graph - Highlight by {criterion.capitalize()}")
        plt.show()

    def _add_legend(self, criterion, ax, fig):
        """Add a color legend to the graph."""
        attribute_values = list(nx.get_node_attributes(self.graph, criterion).values())
        min_value = min(attribute_values, default=0)
        max_value = max(attribute_values, default=1)
        cmap = plt.get_cmap("Blues")  # Changed color map to 'Blues'
        norm = mcolors.Normalize(vmin=min_value, vmax=max_value)

        sm = plt.cm.ScalarMappable(cmap=cmap, norm=norm)
        sm.set_array([])
        cbar = fig.colorbar(sm, ax=ax)
        cbar.set_label(f"{criterion.capitalize()}")
        cbar.ax.tick_params(labelsize=8)


def main():
    # Initialize the graph
    graph = SocialMediaGraph()

    # Add users
    for user_id in ["User1", "User2", "User3", "User4", "User5"]:
        graph.add_user(user_id)

    # Add posts
    posts = [
        ("Post1", 20, 100),
        ("Post2", 50, 200),
        ("Post3", 10, 50),
        ("Post4", 100, 500),
        ("Post5", 500, 1000),
        ("Post6", 100, 500),
        ("Post7", 5, 20),
        ("Post8", 1000, 2000),
        ("Post9", 10, 80),
        ("Post10", 30, 120),
    ]
    for post_id, comments, views in posts:
        graph.add_post(post_id, comments, views)

    # Add connections
    connections = [
        ("User1", "Post1", "author"),
        ("User1", "Post2", "author"),
        ("User2", "Post3", "author"),
        ("User2", "Post4", "author"),
        ("User3", "Post5", "author"),
        ("User3", "Post6", "author"),
        ("User4", "Post7", "author"),
        ("User4", "Post8", "author"),
        ("User5", "Post9", "author"),
        ("User5", "Post10", "author"),
        ("User1", "Post4", "viewing"),
        ("User1", "Post5", "viewing"),
        ("User1", "Post9", "viewing"),
        ("User2", "Post2", "viewing"),
        ("User2", "Post5", "viewing"),
        ("User2", "Post8", "viewing"),
        ("User3", "Post2", "viewing"),
        ("User3", "Post7", "viewing"),
        ("User3", "Post8", "viewing"),
        ("User4", "Post2", "viewing"),
        ("User4", "Post4", "viewing"),
        ("User4", "Post10", "viewing"),
        ("User5", "Post1", "viewing"),
        ("User5", "Post3", "viewing"),
        ("User5", "Post6", "viewing"),
    ]
    for source, destination, connection_type in connections:
        graph.add_connection(source, destination, connection_type)

    # Visualize the graph by comments and views
    graph.draw(criterion="comments")
    graph.draw(criterion="views")


if __name__ == "__main__":
    main()
