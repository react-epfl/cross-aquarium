var json,
    minAge  = -1,
    maxAge  = -1,
    minLast = -1,
    maxLast = -1,
    maxScore = -1,
    minScoreComment = 0,
    maxScoreComment = 0,
    spaceTree = document.getElementById('spaceTree'),
    spaceName = document.getElementById('spaceName'),
    spaceInc  = 0,
    isSessionPrivate;

var readJSON = function(json, privacy) {
    isSessionPrivate = privacy;

    spaceName.innerHTML = json.space.name;
    if(json.space.parent != null) {
        var a = document.createElement('a');
        a.setAttribute('href', '/aquarium/' + json.space.parent._id + (zen ? "?zen" : ""));
        a.classList.add('gotoParent');
        a.innerHTML = "&uarr;";
        spaceName.appendChild(a);
    }

    for(var i = 0, l = json.items.length; i < l; i++) {
        var age = new Date(json.items[i].created);
        age = age.getTime();
        age = (Date.now() - age) / 1000 / 60 / 60 / 24;

        var last = new Date(json.items[i].modified);
        last = last.getTime();
        last = (Date.now() - last) / 1000 / 60 / 60 / 24;

        var score = json.items[i].voteScore;
        score = typeof score !== 'undefined' ? score : 0;
        if(minAge == -1) {
            minAge  = age;
            maxAge  = age;
            minLast = last;
            maxLast = last;
            maxScore = score;
        } else {
            if(age < minAge) minAge = age;
            else if(age > maxAge) maxAge = age;
            if(last < minLast) minLast = last;
            else if(last > maxLast) maxLast = last;
            if(score > maxScore) maxScore = score;
        }

        if (typeof json.items[i].comments !== 'undefined') {
            for(var j = 0, ll = json.items[i].comments.length; j < ll; j++) {
                if (typeof json.items[i].comments[j].replies !== 'undefined') {
                    for(var k = 0, lll = json.items[i].comments[j].replies.length; k < lll; k++) {
                        score = json.items[i].comments[j].replies[k].voteScore;
                        score = typeof score !== 'undefined' ? score : 0;
                        if(score < minScoreComment) minScoreComment = score;
                        else if(score > maxScoreComment) maxScoreComment = score;
                    }
                }
                score = json.items[i].comments[j].voteScore;
                score = typeof score !== 'undefined' ? score : 0;
                if(score < minScoreComment) minScoreComment = score;
                else if(score > maxScoreComment) maxScoreComment = score;
            }
        }
    }

    for(var i = 0, l = json.items.length; i < l; i++) {
        addItem(json.items[i], true);
    }

    if(displayTree.length == 0) {
        displayTree.push([]);
    }

    for(var i = 0, l = json.members.length; i < l; i++) {
        if(fishes.length < 150) addMember(json.members[i], true);
    }
}

var addItem = function(item, intro) {
    if(item._type == "Alias") {
        gems.push(new Gem(item._id, new Vec2D(random(width), height - height / 12)));
        displayTree[displayTree.length - 1].push(gems[gems.length - 1]);
    } else {
        var type, shape;
        switch(item._type) {
            case "Resource":
                type  = 0;
                shape = S_TRIANGLE;
                break;

            case "Application":
                type  = 1;
                shape = S_SQUARE;
                break;

            case "Topic":
                type  = 2;
                shape = S_HEXAGON;
                break;

            case "Space":
                type  = 3;
                shape = S_CIRCLE;
                if(spaceTree.innerHTML != '') spaceTree.innerHTML += ', ';
                var a = document.createElement('a');
                a.setAttribute('href', '/aquarium/' + item._id + (zen ? "?zen" : ""));
                a.innerHTML = typeof item.name !== 'undefined' ? item.name : 'Subspace ' + spaceInc;
                spaceTree.appendChild(a);
                spaceInc++;
                break;
        }

        var age = 0;
        if(typeof item.created !== 'undefined') {
            age = new Date(item.created);
            age = age.getTime();
            age = (Date.now() - age) / 1000 / 60 / 60 / 24;
        }

        var last = 0;
        if(typeof item.modified !== 'undefined') {
            last = new Date(item.modified);
            last = last.getTime();
            last = (Date.now() - last) / 1000 / 60 / 60 / 24;
        }

        rocks.push(new Rock(new Vec2D(random(0, width), height - height/12),
                            constrain(map(age, minAge, maxAge, height/6, height/1.5), height/6, height/1.5),
                            (last > 368 ? PI/2 : constrain(map(last, minLast, maxLast, 0, PI/8), 0, PI/8)) * (random() < .5 ? -1 : 1),
                            shape, shapes[type], item._id, item.voteScore, intro, typeof item.createdByCurrentUser !== 'undefined'));
        rocks[rocks.length - 1].addAlgae();

        if(typeof item.comments !== 'undefined') {
            for(var i = 0, l = item.comments.length; i < l; i++) {
                addComment(item.comments[i], item._id);
            }
        }

        displayTree.push([]);
    }
}

var deleteItem = function(item) {
    for(var i = 0, l = gems.length; i < l; i++) {
        if(gems[i].id == item._id) {
            var deletedItem = gems.splice(i, 1)[0];
            deletedItem.delete();
            break;
        }
    }

    if(deletedItem != null) {
        for(var i = 0, l = displayTree.length; i < l; i++) {
            for(var j = 0, ll = displayTree[i].length; j < ll; j++) {
                if(displayTree[i][j].id == deletedItem.id) {
                    displayTree[i].splice(j, 1);
                    break;
                }
            }
        }
    } else {
        for(var i = 0, l = rocks.length; i < l; i++) {
            if(rocks[i].id == item._id) {
                var deletedItem = rocks.splice(i, 1)[0];
                deletedItem.delete();
                break;
            }
        }
    }

    if(deletedItem == null) {
        console.log("No item with id: " + item.id);
        return;
    }

    for(var i = 0, l = displayTree.length; i < l; i++) {
        for(var j = 0, ll = displayTree[i].length; j < ll; j++) {
            if(displayTree[i][j].id == deletedItem.id) {
                displayTree[i].splice(j, 1);
                break;
            }
        }
    }

    deletedItem = null;
}

var addComment = function(comment, itemId) {
    for(var i = 0, l = rocks.length; i < l; i++) {
        if(typeof itemId !== 'undefined' && rocks[i].id == itemId) {
            rocks[i].addBranch(comment._id, comment.voteScore, true, typeof comment.createdByCurrentUser !== 'undefined');
            if(typeof comment.replies !== 'undefined') {
                for(var j = 0, ll = comment.replies.length; j < ll; j++) {
                    rocks[i].addBranch(comment.replies[j]._id, comment.replies[j].voteScore, true, typeof comment.createdByCurrentUser !== 'undefined', comment._id);
                }
            }
            return;
        } else if(rocks[i].id == comment.itemId) {
            rocks[i].addBranch(comment._id, comment.voteScore, false, typeof comment.createdByCurrentUser !== 'undefined', comment.parentCommentId);
            return;
        }
    }
    console.log("The item with the id: " + itemId + " seems to not be here");
}

var deleteComment = function(comment) {
    for(var i = 0, l = rocks.length; i < l; i++) {
        if(rocks[i].deleteComment(comment._id)) return;
    }
    console.log("No comment with id: " + comment._id + ", or it may be a reply");
}

var addMember = function(member) {
    var index = constrain(map(member.metrics.contributor, 1, 7, 0, displayTree.length - 1), 0, displayTree.length - 1);
    index = Math.floor(index);

    var body = member.metrics.graasper == 0 ? 0 : member.metrics.graasper - 1;

    var tail = constrain(Math.floor(random(0, 4)), 0, 3);

    fishes.push(new Fish(new Vec2D(width/2, height - height / 12), 3.0, 0.1, body, tail, member._id, typeof member.isCurrentUser !== 'undefined'));
    displayTree[index].push(fishes[fishes.length - 1]);
}

var deleteMember = function(member) {
    for(var i = 0, l = fishes.length; i < l; i++) {
        if(fishes[i].id == member._id) {
            var deletedMember = fishes.splice(i, 1)[0];
            break;
        }
    }

    if(deletedMember == null) {
        console.log("No member with id: " + member.id);
        return;
    }

    for(var i = 0, l = displayTree.length; i < l; i++) {
        for(var j = 0, ll = displayTree[i].length; j < ll; j++) {
            if(displayTree[i][j].id == deletedMember.id) {
                displayTree[i].splice(j, 1);
                break;
            }
        }
    }

    deletedMember = null;
}

var updateItem = function(itemData) {
    for(var i = 0, l = rocks.length; i < l; i++) {
        if(rocks[i].id == itemData._id) {
            rocks[i].newAngle = 0;
            rocks[i].score = itemData.voteScore;
            if(itemData.voteScore > maxScore) maxScore = itemData.voteScore;
            return;
        }
    }
}

var updateComment = function(commentData) {
    for(var i = 0, l = rocks.length; i < l; i++) {
        if(rocks[i].changeCommentScore(commentData)) {
            if(commentData.score < minScoreComment) minScoreComment = commentData.score;
            else if(commentData.score > maxScoreComment) maxScoreComment = commentData.score;
            return;
        }
    }
}
