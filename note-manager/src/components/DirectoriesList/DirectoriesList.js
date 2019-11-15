import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Directory from './Directory/Directory';
import DirectoryPreview from './DirectoryPreview/DirectoryPreview';
import DirectoryEdit from './DirectoryEdit/DirectoryEdit';
import { directoryShape } from '../../containers/NoteManager/PropTypes';

const DirectoriesList = props => {
    const currentTab = props.tab || 0;
    let children = null;

    const createDirectoryHandler = (name, parentDirectory) => {
        props.onCreateDirectory({
            name,
            parentId: parentDirectory.id,
            parentParentId: parentDirectory.parentId,
        });
    };

    const editDirectoryHandler = (name, directory) => {
        props.onEditDirectory({
            id: directory.id,
            name,
            parentId: directory.parentId,
        });
    };

    if (!props.directory.folded) {
        children = props.childrenByParentSelector(props.directory.id);
        if (children) {
            children = children.map(directory => (
                <Fragment key={directory.id}>
                    {directory.isEditing
                        ? (
                            <DirectoryEdit
                                tab={currentTab}
                                name={directory.name}
                                isSelected={directory.id === props.selectedDirId}
                                folded={directory.folded}
                                onClick={() => props.triggerDirectoryFold(directory)}
                                onEditDirectory={(name) => editDirectoryHandler(name, directory)}
                                triggerPreviewOff={() => props.triggerEditPreviewOff(directory)} />
                        ) : (
                            <Directory
                                tab={currentTab}
                                name={directory.name}
                                isSelected={directory.id === props.selectedDirId}
                                folded={directory.folded}
                                onClick={() => props.triggerDirectoryFold(directory)} />
                        )}
                    <DirectoriesList
                        tab={currentTab + 1}
                        directory={directory}
                        selectedDirId={props.selectedDirId}
                        childrenByParentSelector={props.childrenByParentSelector}
                        triggerDirectoryFold={props.triggerDirectoryFold}
                        onCreateDirectory={props.onCreateDirectory}
                        triggerCreatePreviewOff={props.triggerCreatePreviewOff}
                        onEditDirectory={props.onEditDirectory}
                        triggerEditPreviewOff={props.triggerEditPreviewOff} />
                </Fragment>
            ));
        }
    }

    return (
        <Fragment>
            {props.directory.isCreatingSubfolder
                ? (
                    <DirectoryPreview
                        tab={currentTab}
                        onCreateDirectory={(name) => createDirectoryHandler(name, props.directory) }
                        triggerPreviewOff={() => props.triggerCreatePreviewOff(props.directory)} />
                ) : null}
            {children}
        </Fragment>
    );
};

DirectoriesList.propTypes = {
    directory: directoryShape.isRequired,
    tab: PropTypes.number,
    selectedDirId: PropTypes.number,
    childrenByParentSelector: PropTypes.func.isRequired,
    triggerDirectoryFold: PropTypes.func.isRequired,
    onCreateDirectory: PropTypes.func.isRequired,
    triggerCreatePreviewOff: PropTypes.func.isRequired,
    onEditDirectory: PropTypes.func.isRequired,
    triggerEditPreviewOff: PropTypes.func.isRequired,
};

export default DirectoriesList;