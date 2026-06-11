@dataclass
class SqlFinding:
    sql_id: str
    title: str
    finding: str
    evidence: list[str]
    recommendation: str