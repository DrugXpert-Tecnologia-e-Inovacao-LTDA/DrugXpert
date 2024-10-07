"use client";
import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import initRDKitModule from "@rdkit/rdkit";

const initRDKit = (() => {
  let rdkitLoadingPromise;
  return () => {
    if (!rdkitLoadingPromise) {
      rdkitLoadingPromise = new Promise((resolve, reject) => {
        initRDKitModule()
          .then((RDKit) => resolve(RDKit))
          .catch((e) => reject(e));
      });
    }
    return rdkitLoadingPromise;
  };
})();

class MoleculeStructure extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    svgMode: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    structure: PropTypes.string.isRequired,
    subStructure: PropTypes.string,
    extraDetails: PropTypes.object,
    drawingDelay: PropTypes.number,
    scores: PropTypes.number,
  };

  static defaultProps = {
    subStructure: "",
    className: "",
    width: 250,
    height: 200,
    svgMode: false,
    extraDetails: {},
    drawingDelay: undefined,
    scores: 0,
  };

  constructor(props) {
    super(props);
    this.MOL_DETAILS = {
      width: this.props.width,
      height: this.props.height,
      bondLineWidth: 1,
      addStereoAnnotation: true,
      ...this.props.extraDetails,
    };

    this.state = {
      svg: undefined,
      rdKitLoaded: false,
      rdKitError: false,
    };
  }

  // Ensure drawing only happens once after mounting
  drawOnce = (() => {
    let wasCalled = false;
    return () => {
      if (!wasCalled) {
        wasCalled = true;
        this.draw();
      }
    };
  })();

  // Drawing logic
  draw() {
    if (this.props.drawingDelay) {
      setTimeout(() => this.drawSVGorCanvas(), this.props.drawingDelay);
    } else {
      this.drawSVGorCanvas();
    }
  }

  // Handles drawing either SVG or canvas, based on props
  drawSVGorCanvas() {
    const mol = this.RDKit.get_mol(this.props.structure || "invalid");
    const qmol = this.RDKit.get_qmol(this.props.subStructure || "invalid");

    if (this.isValidMol(mol)) {
      if (this.props.svgMode) {
        const svg = mol.get_svg_with_highlights(this.getMolDetails(mol, qmol));
        this.setState({ svg });
      } else {
        const canvas = document.getElementById(this.props.id);
        mol.draw_to_canvas_with_highlights(canvas, this.getMolDetails(mol, qmol));
      }
    }

    mol?.delete();
    qmol?.delete();
  }

  // Check if molecule is valid
  isValidMol(mol) {
    return !!mol && mol.is_valid();
  }

  // Get molecule drawing details including highlights
  getMolDetails(mol, qmol) {
    let subStructHighlightDetailsMerged = {};
    if (this.isValidMol(mol) && this.isValidMol(qmol)) {
      const subStructHighlightDetails = JSON.parse(mol.get_substruct_matches(qmol));
      subStructHighlightDetailsMerged = _.isEmpty(subStructHighlightDetails)
        ? {}
        : subStructHighlightDetails.reduce(
            (acc, { atoms, bonds }) => ({
              atoms: [...acc.atoms, ...atoms],
              bonds: [...acc.bonds, ...bonds],
            }),
            { bonds: [], atoms: [] },
          );
    }
    return JSON.stringify({
      ...this.MOL_DETAILS,
      ...(this.props.extraDetails || {}),
      ...subStructHighlightDetailsMerged,
    });
  }

  // Load RDKit when the component mounts
  componentDidMount() {
    initRDKit()
      .then((RDKit) => {
        this.RDKit = RDKit;
        this.setState({ rdKitLoaded: true });
        try {
          this.draw();
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.error("RDKit Load Error:", err);
        this.setState({ rdKitError: true });
      });
  }

  // Redraw on component update when necessary
  componentDidUpdate(prevProps) {
    if (
      !this.state.rdKitError &&
      this.state.rdKitLoaded &&
      !this.props.svgMode
    ) {
      this.drawOnce();
    }

    if (this.state.rdKitLoaded) {
      const shouldUpdateDrawing =
        prevProps.structure !== this.props.structure ||
        prevProps.svgMode !== this.props.svgMode ||
        prevProps.subStructure !== this.props.subStructure ||
        prevProps.width !== this.props.width ||
        prevProps.height !== this.props.height ||
        !_.isEqual(prevProps.extraDetails, this.props.extraDetails);

      if (shouldUpdateDrawing) {
        this.draw();
      }
    }
  }

  render() {
    if (this.state.rdKitError) {
      return <div>Error loading renderer.</div>;
    }
    if (!this.state.rdKitLoaded) {
      return <div>Loading renderer...</div>;
    }

    const mol = this.RDKit.get_mol(this.props.structure || "invalid");
    const isValidMol = this.isValidMol(mol);
    mol?.delete();

    if (!isValidMol) {
      return <span title={`Cannot render structure: ${this.props.structure}`}>Render Error.</span>;
    } else if (this.props.svgMode) {
      return (
        <div
          title={this.props.structure}
          className={"molecule-structure-svg " + (this.props.className || "")}
          style={{ width: this.props.width, height: this.props.height }}
          dangerouslySetInnerHTML={{ __html: this.state.svg }}
        />
      );
    } else {
      return (
        <div className={"molecule-canvas-container " + (this.props.className || "")}>
          <canvas
            title={this.props.structure}
            id={this.props.id}
            width={this.props.width}
            height={this.props.height}
          />
          {this.props.scores ? (
            <p className="text-red-600 z-50 p-10">Score: {this.props.scores.toFixed(2)}</p>
          ) : null}
        </div>
      );
    }
  }
}

export default MoleculeStructure;
