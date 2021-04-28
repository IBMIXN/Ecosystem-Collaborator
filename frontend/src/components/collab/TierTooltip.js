import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

function TierTooltip() {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Tiers</Popover.Title>
      <Popover.Content>
        <strong>Tier 1</strong> results have at least one of the selected
        industries as one of their <strong>primary </strong>
        industries.
      </Popover.Content>
      <Popover.Content>
        <strong>Tier 2</strong> results have at least one of the selected
        industries as one of their <strong>secondary </strong>
        industries.
      </Popover.Content>
      <Popover.Content>
        <strong>Tier 3</strong> offer to work with all industries.
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger key="yes" placement="right" overlay={popover}>
      <span>What are tiers?</span>
    </OverlayTrigger>
  );
}

export default TierTooltip;
