"""Seed STEM concept nodes and edges

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-12
"""
from typing import Sequence, Union
from alembic import op
from sqlalchemy import text as sa_text

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

CONCEPTS = [
    # Physics — Motion
    ("kinematics", "Kinematics", "physics", "Motion", "The branch of mechanics describing the motion of objects without considering forces.", "beginner", "move", "#3B82F6", 1),
    ("displacement", "Displacement", "physics", "Motion", "The change in position of an object; a vector quantity with magnitude and direction.", "beginner", "arrow-right", "#60A5FA", 2),
    ("velocity", "Velocity", "physics", "Motion", "The rate of change of displacement with respect to time; a vector quantity.", "beginner", "zap", "#3B82F6", 3),
    ("acceleration", "Acceleration", "physics", "Motion", "The rate of change of velocity with respect to time.", "beginner", "trending-up", "#1D4ED8", 4),
    ("projectile-motion", "Projectile Motion", "physics", "Motion", "The curved path of an object launched into the air under gravity, following parabolic trajectory.", "intermediate", "target", "#2563EB", 5),
    ("circular-motion", "Circular Motion", "physics", "Motion", "Motion of an object along a circular path at constant or varying speed.", "intermediate", "rotate-cw", "#1E40AF", 6),
    # Physics — Forces
    ("force", "Force", "physics", "Forces", "Any interaction that, when unopposed, changes the motion of an object. Measured in Newtons.", "beginner", "hand-metal", "#7C3AED", 7),
    ("mass", "Mass", "physics", "Forces", "The amount of matter in an object; a scalar quantity measured in kilograms.", "beginner", "package", "#6D28D9", 8),
    ("weight", "Weight", "physics", "Forces", "The gravitational force acting on an object's mass; W = mg.", "beginner", "scale", "#5B21B6", 9),
    ("friction", "Friction", "physics", "Forces", "A force that opposes relative motion between surfaces in contact.", "beginner", "minus", "#7C3AED", 10),
    ("momentum", "Momentum", "physics", "Forces", "The product of mass and velocity; p = mv. A conserved quantity in closed systems.", "intermediate", "chevrons-right", "#6D28D9", 11),
    ("gravity", "Gravity", "physics", "Forces", "The fundamental force of attraction between masses. Near Earth's surface g ≈ 9.81 m/s².", "beginner", "arrow-down", "#4C1D95", 12),
    # Physics — Energy
    ("energy", "Energy", "physics", "Energy", "The capacity to do work. Exists in kinetic, potential, thermal, and other forms.", "beginner", "battery-charging", "#059669", 13),
    ("work", "Work", "physics", "Energy", "Energy transferred when a force moves an object through a displacement; W = F·d·cos(θ).", "beginner", "tool", "#10B981", 14),
    ("power", "Power", "physics", "Energy", "The rate at which work is done or energy is transferred; P = W/t, measured in Watts.", "intermediate", "zap", "#34D399", 15),
    # Physics — Waves
    ("waves", "Waves", "physics", "Waves", "Periodic disturbances that transfer energy through a medium or vacuum.", "intermediate", "activity", "#0EA5E9", 16),
    ("frequency", "Frequency", "physics", "Waves", "The number of wave cycles per unit time; measured in Hertz (Hz).", "beginner", "bar-chart-2", "#0284C7", 17),
    ("amplitude", "Amplitude", "physics", "Waves", "The maximum displacement of a wave from its equilibrium position.", "beginner", "git-commit", "#0369A1", 18),
    # Physics — Electricity
    ("electric-charge", "Electric Charge", "physics", "Electricity", "A fundamental property of matter causing electromagnetic force. Measured in Coulombs.", "intermediate", "plus-circle", "#F59E0B", 19),
    ("electric-current", "Electric Current", "physics", "Electricity", "The flow of electric charge; I = Q/t, measured in Amperes.", "intermediate", "zap", "#D97706", 20),

    # Chemistry — Atomic Structure
    ("atom", "Atom", "chemistry", "Atomic Structure", "The smallest unit of a chemical element, consisting of protons, neutrons, and electrons.", "beginner", "circle", "#10B981", 1),
    ("element", "Element", "chemistry", "Atomic Structure", "A pure substance consisting of only one type of atom, defined by its atomic number.", "beginner", "hash", "#059669", 2),
    ("periodic-table", "Periodic Table", "chemistry", "Atomic Structure", "An organized arrangement of all known chemical elements by atomic number and properties.", "beginner", "grid", "#047857", 3),
    # Chemistry — Molecular Structure
    ("molecule", "Molecule", "chemistry", "Molecular Structure", "Two or more atoms bonded together to form the smallest unit of a compound.", "beginner", "share-2", "#34D399", 4),
    ("compound", "Compound", "chemistry", "Molecular Structure", "A substance formed from two or more different elements chemically bonded together.", "beginner", "link", "#6EE7B7", 5),
    ("mixture", "Mixture", "chemistry", "Molecular Structure", "A combination of substances not chemically bonded; can be separated by physical means.", "beginner", "shuffle", "#A7F3D0", 6),
    # Chemistry — Reactions
    ("chemical-reaction", "Chemical Reaction", "chemistry", "Reactions", "A process where reactants transform into products through bond breaking and formation.", "intermediate", "git-merge", "#F59E0B", 7),
    ("oxidation", "Oxidation", "chemistry", "Reactions", "Loss of electrons or increase in oxidation state of a substance in a reaction.", "intermediate", "plus", "#D97706", 8),
    ("reduction", "Reduction", "chemistry", "Reactions", "Gain of electrons or decrease in oxidation state of a substance in a reaction.", "intermediate", "minus", "#B45309", 9),
    ("mole", "Mole", "chemistry", "Measurements", "A unit of amount equal to 6.022×10²³ particles (Avogadro's number).", "intermediate", "calculator", "#92400E", 10),
    # Chemistry — Acids & Bases
    ("acid", "Acid", "chemistry", "Acids & Bases", "A substance that donates protons (H⁺) or accepts electrons; pH < 7.", "intermediate", "droplet", "#EF4444", 11),
    ("base", "Base", "chemistry", "Acids & Bases", "A substance that accepts protons or donates electrons; pH > 7.", "intermediate", "droplets", "#3B82F6", 12),
    ("pH", "pH Scale", "chemistry", "Acids & Bases", "A logarithmic scale measuring the hydrogen ion concentration; ranges from 0 to 14.", "intermediate", "sliders", "#8B5CF6", 13),

    # Mathematics — Algebra
    ("algebra", "Algebra", "mathematics", "Algebra", "The branch of mathematics dealing with symbols and rules for manipulating those symbols.", "beginner", "type", "#8B5CF6", 1),
    ("variable", "Variable", "mathematics", "Algebra", "A symbol representing an unknown or changing quantity in mathematical expressions.", "beginner", "x", "#7C3AED", 2),
    ("equation", "Equation", "mathematics", "Algebra", "A mathematical statement asserting the equality of two expressions.", "beginner", "equal", "#6D28D9", 3),
    ("function", "Function", "mathematics", "Algebra", "A relation that maps each input to exactly one output; f(x) notation.", "intermediate", "git-branch", "#5B21B6", 4),
    ("matrix", "Matrix", "mathematics", "Algebra", "A rectangular array of numbers arranged in rows and columns, used in linear algebra.", "advanced", "grid", "#4C1D95", 5),
    # Mathematics — Calculus
    ("calculus", "Calculus", "mathematics", "Calculus", "The branch of mathematics studying continuous change, via derivatives and integrals.", "advanced", "trending-up", "#DB2777", 6),
    ("derivative", "Derivative", "mathematics", "Calculus", "The instantaneous rate of change of a function; dy/dx.", "advanced", "trending-up", "#BE185D", 7),
    ("integral", "Integral", "mathematics", "Calculus", "The area under a curve; the inverse operation of differentiation.", "advanced", "bar-chart", "#9D174D", 8),
    # Mathematics — Geometry
    ("geometry", "Geometry", "mathematics", "Geometry", "The branch of mathematics concerned with shapes, sizes, and properties of figures.", "beginner", "triangle", "#0EA5E9", 9),
    ("trigonometry", "Trigonometry", "mathematics", "Geometry", "The study of relationships between angles and sides of triangles; sin, cos, tan.", "intermediate", "radio", "#0284C7", 10),
    ("vector", "Vector", "mathematics", "Geometry", "A quantity with both magnitude and direction, represented as an arrow or components.", "intermediate", "arrow-up-right", "#0369A1", 11),
    # Mathematics — Statistics
    ("statistics", "Statistics", "mathematics", "Statistics", "The science of collecting, analyzing, and interpreting numerical data.", "intermediate", "bar-chart-2", "#64748B", 12),
    ("probability", "Probability", "mathematics", "Statistics", "The measure of likelihood that an event will occur; ranges from 0 to 1.", "intermediate", "percent", "#475569", 13),
]

EDGES = [
    # Physics Motion chain
    ("displacement", "velocity", "prerequisite"),
    ("velocity", "acceleration", "prerequisite"),
    ("velocity", "kinetic-energy", "related"),
    ("displacement", "projectile-motion", "prerequisite"),
    ("velocity", "projectile-motion", "prerequisite"),
    ("acceleration", "projectile-motion", "prerequisite"),
    ("gravity", "projectile-motion", "prerequisite"),
    ("trigonometry", "projectile-motion", "prerequisite"),
    ("velocity", "circular-motion", "prerequisite"),
    ("acceleration", "circular-motion", "prerequisite"),
    # Physics Forces chain
    ("mass", "force", "prerequisite"),
    ("mass", "weight", "prerequisite"),
    ("gravity", "weight", "prerequisite"),
    ("force", "momentum", "prerequisite"),
    ("mass", "momentum", "prerequisite"),
    ("force", "friction", "related"),
    ("acceleration", "force", "related"),
    # Physics Energy chain
    ("force", "work", "prerequisite"),
    ("displacement", "work", "prerequisite"),
    ("work", "energy", "prerequisite"),
    ("velocity", "energy", "prerequisite"),
    ("energy", "power", "prerequisite"),
    ("work", "power", "prerequisite"),
    # Physics Waves
    ("energy", "waves", "prerequisite"),
    ("waves", "frequency", "prerequisite"),
    ("waves", "amplitude", "prerequisite"),
    ("frequency", "amplitude", "related"),
    # Physics Electricity
    ("electric-charge", "electric-current", "prerequisite"),
    # Chemistry chain
    ("atom", "element", "prerequisite"),
    ("atom", "molecule", "prerequisite"),
    ("atom", "periodic-table", "prerequisite"),
    ("element", "compound", "prerequisite"),
    ("molecule", "compound", "prerequisite"),
    ("compound", "mixture", "related"),
    ("element", "chemical-reaction", "prerequisite"),
    ("chemical-reaction", "oxidation", "prerequisite"),
    ("chemical-reaction", "reduction", "prerequisite"),
    ("oxidation", "reduction", "related"),
    ("acid", "pH", "prerequisite"),
    ("base", "pH", "prerequisite"),
    ("chemical-reaction", "acid", "related"),
    ("chemical-reaction", "base", "related"),
    ("atom", "mole", "prerequisite"),
    # Mathematics chain
    ("variable", "equation", "prerequisite"),
    ("algebra", "equation", "related"),
    ("equation", "function", "prerequisite"),
    ("function", "derivative", "prerequisite"),
    ("derivative", "integral", "prerequisite"),
    ("geometry", "trigonometry", "prerequisite"),
    ("trigonometry", "calculus", "prerequisite"),
    ("function", "calculus", "prerequisite"),
    ("algebra", "calculus", "prerequisite"),
    ("vector", "calculus", "related"),
    ("statistics", "probability", "related"),
    ("algebra", "matrix", "prerequisite"),
    # Cross-subject
    ("velocity", "derivative", "related"),
    ("acceleration", "derivative", "related"),
    ("displacement", "integral", "related"),
    ("trigonometry", "waves", "related"),
    ("vector", "force", "related"),
    ("vector", "velocity", "related"),
    ("statistics", "probability", "prerequisite"),
]


def upgrade() -> None:
    connection = op.get_bind()

    # Insert concept nodes
    for slug, name, subject, category, description, difficulty, icon, color, sort_order in CONCEPTS:
        connection.execute(
            sa_text("""
                INSERT INTO concept_nodes (slug, name, subject, category, description, difficulty, icon, color, sort_order)
                VALUES (:slug, :name, :subject, :category, :description, :difficulty, :icon, :color, :sort_order)
                ON CONFLICT (slug) DO NOTHING
            """),
            {
                "slug": slug, "name": name, "subject": subject, "category": category,
                "description": description, "difficulty": difficulty, "icon": icon,
                "color": color, "sort_order": sort_order,
            }
        )

    # Insert concept edges (only between concepts that exist)
    for from_slug, to_slug, relationship in EDGES:
        connection.execute(
            sa_text("""
                INSERT INTO concept_edges (from_concept_id, to_concept_id, relationship)
                SELECT f.id, t.id, :relationship
                FROM concept_nodes f, concept_nodes t
                WHERE f.slug = :from_slug AND t.slug = :to_slug
                ON CONFLICT DO NOTHING
            """),
            {"from_slug": from_slug, "to_slug": to_slug, "relationship": relationship}
        )


def downgrade() -> None:
    connection = op.get_bind()
    slugs = [row[0] for row in CONCEPTS]
    for slug in slugs:
        connection.execute(sa_text("DELETE FROM concept_nodes WHERE slug = :slug"), {"slug": slug})
